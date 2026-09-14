/**
 * Verify the live production deployment is a forward build of main, from the
 * right repo and project.
 *
 * Incident this exists for: on 2026-09-11 someone clicked "Redeploy" on a
 * two-day-old row in the Vercel dashboard. That silently replaced production
 * with a pre-fix commit (reverting the site's phone number to a retired
 * number) with no error, no failed check, and no alert for 3 days — nothing
 * else in this repo would have caught a rollback that isn't a code change.
 *
 *   node scripts/production-drift-guard.mjs
 *
 * Requires VERCEL_TOKEN (read-only) and full git history (fetch-depth: 0).
 *
 * Resolves the deployment by the live custom domain, not by project ID: a
 * project-ID lookup only ever inspects the project you already assume is
 * correct, so it can't catch the domain itself moving to a different Vercel
 * project (a real, adjacent risk found while investigating — a look-alike
 * project for this same repo exists on a personal fork in the same team).
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const VERCEL_TEAM_ID = "team_6MHFnFIZBeG8WO7ZXF0EPwyR";
export const EXPECTED_PROJECT_ID = "prj_5LPEuNOIpEoRgM01QJZQEh8QjTfT";
export const EXPECTED_GITHUB_ORG = "artificialBRIDGEllc";
export const EXPECTED_GITHUB_REPO = "insureitall-llc.com";
// The apex 307-redirects here (docs/audits/AUD-20260825-insureitall-llc.com.md, lines 3 & 13);
// check the host visitors actually land on, not the one that just forwards to it.
export const PRODUCTION_DOMAIN = "www.insureitall-llc.com";
export const BASELINE_PATH = ".github/state/last-known-good-production-sha.txt";

// Distinct from a real finding (exit 1): the guard couldn't even run its
// checks (missing token, Vercel API/network failure). Kept separate so the
// workflow never files a "production is down" issue for "the secret isn't
// configured yet."
export const EXIT_GUARD_ERROR = 2;

export async function fetchLiveDeployment({
  token,
  domain = PRODUCTION_DOMAIN,
  teamId = VERCEL_TEAM_ID,
  fetchImpl = fetch,
}) {
  const url = `https://api.vercel.com/v13/deployments/${encodeURIComponent(domain)}?teamId=${teamId}`;
  const res = await fetchImpl(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`Vercel API ${res.status}: ${await res.text()}`);
  return res.json();
}

// Matches git's "this object doesn't exist in this checkout at all" fatal
// error — distinct from "not a git repository"/other corruption, which
// should still propagate. Confirmed both exit 128; only the message differs.
const UNKNOWN_OBJECT_RE = /Not a valid object name|bad revision|unknown revision/i;

export function gitIsAncestor(ancestorSha, descendantSha, { cwd } = {}) {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", ancestorSha, descendantSha], {
      stdio: ["ignore", "ignore", "pipe"],
      cwd,
    });
    return true;
  } catch (err) {
    // git exits 1 for a clean "not an ancestor" answer — a real result, not
    // a failure. It also exits 128 when a SHA isn't a known object in this
    // checkout at all, which is just as real an answer for this guard: a
    // commit from a completely different history (the wrong-project/
    // unmerged-branch case this guard exists to catch) is exactly as "not
    // in main's history" as a known-but-unrelated commit. Only something
    // else entirely (a missing git binary, a genuinely broken checkout)
    // should propagate to the guard-error path instead of a real finding.
    if (err.status === 1) return false;
    if (err.status === 128 && UNKNOWN_OBJECT_RE.test(err.stderr?.toString() ?? "")) return false;
    throw err;
  }
}

export function evaluateDeployment(deployment, { headSha, baselineSha, isAncestor = gitIsAncestor } = {}) {
  const prodSha = deployment?.meta?.githubCommitSha ?? null;
  const org = deployment?.meta?.githubOrg;
  const repo = deployment?.meta?.githubRepo;
  const projectId = deployment?.project?.id ?? deployment?.projectId;
  const readyState = deployment?.readyState;
  const problems = [];

  if (!prodSha) {
    return { ok: false, prodSha, problems: ["the live deployment has no githubCommitSha in its metadata"] };
  }
  if (readyState !== "READY") {
    problems.push(`the live deployment's state is ${readyState ?? "unknown"}, not READY — refusing to trust it`);
  }
  if (projectId !== EXPECTED_PROJECT_ID) {
    problems.push(
      `the production domain now resolves to Vercel project ${projectId}, expected ${EXPECTED_PROJECT_ID} — it may have moved to a different project`,
    );
  }
  if (org !== EXPECTED_GITHUB_ORG || repo !== EXPECTED_GITHUB_REPO) {
    problems.push(`the live deployment is built from ${org}/${repo}, expected ${EXPECTED_GITHUB_ORG}/${EXPECTED_GITHUB_REPO}`);
  }
  if (headSha && prodSha !== headSha && !isAncestor(prodSha, headSha)) {
    problems.push(`live commit ${prodSha} is not in main's history — it was not built from a merged commit`);
  }
  if (baselineSha && prodSha !== baselineSha && !isAncestor(baselineSha, prodSha)) {
    problems.push(
      `live commit ${prodSha} is not a descendant of the last verified commit ${baselineSha} — production has been rolled back`,
    );
  }

  return { ok: problems.length === 0, prodSha, problems };
}

function readBaseline(path) {
  return existsSync(path) ? readFileSync(path, "utf8").trim() || null : null;
}

function writeBaseline(path, sha) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${sha}\n`);
}

const isMain = process.argv[1] && process.argv[1].endsWith("production-drift-guard.mjs");
if (isMain) {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.error("guard-error  VERCEL_TOKEN is not set");
    process.exit(EXIT_GUARD_ERROR);
  }

  // Everything below is either a real finding (exit 1, from evaluateDeployment
  // alone) or the guard failing to run at all (exit 2) — a git, filesystem, or
  // network problem here must never surface as "production is down" just
  // because it happened to leave the process at a nonzero exit code.
  try {
    // Refresh main immediately before comparing, not just at job checkout —
    // a commit merged and deployed during earlier steps (cache restore, node
    // setup) would otherwise be missing from this job's now-stale snapshot,
    // making perfectly healthy production look like it isn't in main's
    // history yet.
    execFileSync("git", ["fetch", "--quiet", "origin", "main"]);
    const headSha = execFileSync("git", ["rev-parse", "origin/main"]).toString().trim();
    const baselineSha = readBaseline(BASELINE_PATH);
    const deployment = await fetchLiveDeployment({ token });
    const result = evaluateDeployment(deployment, { headSha, baselineSha });

    if (result.ok) {
      const note = baselineSha ? "" : " (baseline initialized)";
      console.log(`ok     production is verified at ${result.prodSha}${note}`);
      if (result.prodSha !== baselineSha) writeBaseline(BASELINE_PATH, result.prodSha);
      process.exit(0);
    }

    for (const problem of result.problems) console.error(`error  ${problem}`);
    process.exit(1);
  } catch (err) {
    console.error(`guard-error  could not complete the check: ${err.message}`);
    process.exit(EXIT_GUARD_ERROR);
  }
}
