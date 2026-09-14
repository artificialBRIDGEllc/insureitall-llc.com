import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  evaluateDeployment,
  fetchLiveDeployment,
  gitIsAncestor,
  EXPECTED_GITHUB_ORG,
  EXPECTED_GITHUB_REPO,
  EXPECTED_PROJECT_ID,
} from "./production-drift-guard.mjs";

function deployment(overrides = {}) {
  const { meta, ...rest } = overrides;
  return {
    readyState: "READY",
    project: { id: EXPECTED_PROJECT_ID },
    meta: {
      githubCommitSha: "f07db04",
      githubOrg: EXPECTED_GITHUB_ORG,
      githubRepo: EXPECTED_GITHUB_REPO,
      ...meta,
    },
    ...rest,
  };
}

test("passes when production is the current head and no baseline yet", () => {
  const result = evaluateDeployment(deployment(), { headSha: "f07db04", baselineSha: null });
  assert.equal(result.ok, true);
  assert.equal(result.prodSha, "f07db04");
});

test("passes when production has moved forward of the baseline", () => {
  const result = evaluateDeployment(deployment({ meta: { githubCommitSha: "b2" } }), {
    headSha: "b2",
    baselineSha: "a1",
    isAncestor: (ancestor, descendant) => ancestor === "a1" && descendant === "b2",
  });
  assert.equal(result.ok, true);
});

test("flags a rollback behind the last verified commit", () => {
  const result = evaluateDeployment(deployment({ meta: { githubCommitSha: "a1" } }), {
    headSha: "b2",
    baselineSha: "b2",
    isAncestor: (ancestor, descendant) => ancestor === "a1" && descendant === "b2",
  });
  assert.equal(result.ok, false);
  assert.match(result.problems[0], /rolled back/);
});

test("flags a commit that isn't in main's history at all", () => {
  const result = evaluateDeployment(deployment({ meta: { githubCommitSha: "deadbeef" } }), {
    headSha: "b2",
    baselineSha: null,
    isAncestor: () => false,
  });
  assert.equal(result.ok, false);
  assert.match(result.problems[0], /not in main's history/);
});

test("flags a deployment built from the wrong repo", () => {
  const result = evaluateDeployment(deployment({ meta: { githubOrg: "copperlang2007" } }), {
    headSha: "f07db04",
    baselineSha: null,
  });
  assert.equal(result.ok, false);
  assert.match(result.problems[0], /copperlang2007/);
});

test("flags the domain resolving to a different Vercel project", () => {
  const result = evaluateDeployment(deployment({ project: { id: "prj_someone_elses_fork" } }), {
    headSha: "f07db04",
    baselineSha: null,
  });
  assert.equal(result.ok, false);
  assert.match(result.problems[0], /different project/);
});

test("flags a deployment that isn't READY yet", () => {
  const result = evaluateDeployment(deployment({ readyState: "BUILDING" }), {
    headSha: "f07db04",
    baselineSha: null,
  });
  assert.equal(result.ok, false);
  assert.match(result.problems[0], /not READY/);
});

test("flags a deployment with no commit metadata", () => {
  const result = evaluateDeployment({ meta: {} }, { headSha: "f07db04", baselineSha: null });
  assert.equal(result.ok, false);
  assert.equal(result.prodSha, null);
});

test("accepts the reduced-schema top-level projectId as a fallback", () => {
  const result = evaluateDeployment(deployment({ project: undefined, projectId: EXPECTED_PROJECT_ID }), {
    headSha: "f07db04",
    baselineSha: null,
  });
  assert.equal(result.ok, true);
});

test("gitIsAncestor returns true/false for real ancestry", () => {
  // A throwaway two-commit repo, not this checkout's own history: CI runs
  // this suite from a shallow clone (fetch-depth 1, no parent commits), so
  // asserting against HEAD~1 here would fail there even though the guard
  // logic is fine — this repo's depth is under this test's control instead.
  const dir = mkdtempSync(join(tmpdir(), "drift-guard-test-"));
  try {
    execFileSync("git", ["init", "--quiet"], { cwd: dir });
    execFileSync("git", ["config", "user.email", "test@example.com"], { cwd: dir });
    execFileSync("git", ["config", "user.name", "test"], { cwd: dir });
    writeFileSync(join(dir, "a.txt"), "a");
    execFileSync("git", ["add", "a.txt"], { cwd: dir });
    execFileSync("git", ["commit", "--quiet", "-m", "first"], { cwd: dir });
    const parent = execFileSync("git", ["rev-parse", "HEAD"], { cwd: dir }).toString().trim();

    writeFileSync(join(dir, "b.txt"), "b");
    execFileSync("git", ["add", "b.txt"], { cwd: dir });
    execFileSync("git", ["commit", "--quiet", "-m", "second"], { cwd: dir });
    const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: dir }).toString().trim();

    assert.equal(gitIsAncestor(parent, head, { cwd: dir }), true);
    assert.equal(gitIsAncestor(head, parent, { cwd: dir }), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gitIsAncestor returns false (not a throw) for a commit unknown to this checkout", () => {
  // A commit from a completely different history — the wrong-project or
  // unmerged-branch case this guard exists to catch — is a real "not in
  // main's history" answer, not a guard failure, even though git's exit
  // code for it (128, "Not a valid object name") differs from the plain
  // "not an ancestor" case (1).
  assert.equal(gitIsAncestor("0000000000000000000000000000000000dead", "HEAD"), false);
});

test("gitIsAncestor throws (does not silently return false) for a genuine git failure", () => {
  // A directory that isn't a git repository at all is also exit 128, but
  // with a different message ("not a git repository") that must NOT be
  // confused with "unknown object" — this really is a guard failure.
  const dir = mkdtempSync(join(tmpdir(), "drift-guard-not-a-repo-"));
  try {
    assert.throws(() => gitIsAncestor("abc123", "def456", { cwd: dir }));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("fetchLiveDeployment builds the expected URL, auth header, and timeout", async () => {
  let capturedUrl;
  let capturedInit;
  const fakeFetch = async (url, init) => {
    capturedUrl = url;
    capturedInit = init;
    return { ok: true, json: async () => ({ readyState: "READY" }) };
  };

  const body = await fetchLiveDeployment({
    token: "test-token",
    domain: "www.insureitall-llc.com",
    teamId: "team_test",
    fetchImpl: fakeFetch,
  });

  assert.equal(capturedUrl, "https://api.vercel.com/v13/deployments/www.insureitall-llc.com?teamId=team_test");
  assert.equal(capturedInit.headers.Authorization, "Bearer test-token");
  assert.ok(capturedInit.signal instanceof AbortSignal);
  assert.deepEqual(body, { readyState: "READY" });
});

test("fetchLiveDeployment throws with the status and body on a non-2xx response", async () => {
  const fakeFetch = async () => ({ ok: false, status: 403, text: async () => "forbidden" });

  await assert.rejects(
    fetchLiveDeployment({ token: "bad-token", fetchImpl: fakeFetch }),
    /Vercel API 403: forbidden/,
  );
});
