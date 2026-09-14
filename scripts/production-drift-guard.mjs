/**
 * Verify the live production deployment is a forward build of main, from the
 * right repo.
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
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const VERCEL_TEAM_ID = "team_6MHFnFIZBeG8WO7ZXF0EPwyR";
export const VERCEL_PROJECT_ID = "prj_5LPEuNOIpEoRgM01QJZQEh8QjTfT";
export const EXPECTED_GITHUB_ORG = "artificialBRIDGEllc";
export const EXPECTED_GITHUB_REPO = "insureitall-llc.com";
export const BASELINE_PATH = ".github/state/last-known-good-production-sha.txt";

export async function fetchLatestProductionDeployment({
  token,
  teamId = VERCEL_TEAM_ID,
  projectId = VERCEL_PROJECT_ID,
  fetchImpl = fetch,
}) {
  const url = `https://api.vercel.com/v6/deployments?projectId=${projectId}&target=production&limit=1&teamId=${teamId}`;
  const res = await fetchImpl(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Vercel API ${res.status}: ${await res.text()}`);
  const body = await res.json();
  const deployment = body.deployments?.[0];
  if (!deployment) throw new Error("Vercel API returned no production deployments");
  return deployment;
}

function gitIsAncestor(ancestorSha, descendantSha) {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", ancestorSha, descendantSha], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function evaluateDeployment(deployment, { headSha, baselineSha, isAncestor = gitIsAncestor } = {}) {
  const prodSha = deployment?.meta?.githubCommitSha ?? null;
  const org = deployment?.meta?.githubOrg;
  const repo = deployment?.meta?.githubRepo;
  const problems = [];

  if (!prodSha) {
    return { ok: false, prodSha, problems: ["production deployment has no githubCommitSha in its metadata"] };
  }
  if (org !== EXPECTED_GITHUB_ORG || repo !== EXPECTED_GITHUB_REPO) {
    problems.push(
      `production is built from ${org}/${repo}, expected ${EXPECTED_GITHUB_ORG}/${EXPECTED_GITHUB_REPO} — the domain may be pointed at the wrong Vercel project`,
    );
  }
  if (headSha && prodSha !== headSha && !isAncestor(prodSha, headSha)) {
    problems.push(`production commit ${prodSha} is not in main's history — it was not built from a merged commit`);
  }
  if (baselineSha && prodSha !== baselineSha && !isAncestor(baselineSha, prodSha)) {
    problems.push(
      `production commit ${prodSha} is not a descendant of the last verified commit ${baselineSha} — production has been rolled back`,
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
    console.error("error  VERCEL_TOKEN is not set");
    process.exit(1);
  }

  const headSha = execFileSync("git", ["rev-parse", "HEAD"]).toString().trim();
  const baselineSha = readBaseline(BASELINE_PATH);

  const deployment = await fetchLatestProductionDeployment({ token });
  const result = evaluateDeployment(deployment, { headSha, baselineSha });

  if (result.ok) {
    const note = baselineSha ? "" : " (baseline initialized)";
    console.log(`ok     production is verified at ${result.prodSha}${note}`);
    if (result.prodSha !== baselineSha) writeBaseline(BASELINE_PATH, result.prodSha);
    process.exit(0);
  }

  for (const problem of result.problems) console.error(`error  ${problem}`);
  process.exit(1);
}
