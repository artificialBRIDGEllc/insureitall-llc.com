import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
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

test("gitIsAncestor returns true/false for real ancestry against this repo's own history", () => {
  const head = execFileSync("git", ["rev-parse", "HEAD"]).toString().trim();
  const parent = execFileSync("git", ["rev-parse", "HEAD~1"]).toString().trim();
  assert.equal(gitIsAncestor(parent, head), true);
  assert.equal(gitIsAncestor(head, parent), false);
});

test("gitIsAncestor throws (does not silently return false) for a git-level error", () => {
  assert.throws(() => gitIsAncestor("0000000000000000000000000000000000dead", "HEAD"));
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
