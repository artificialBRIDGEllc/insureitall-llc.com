import assert from "node:assert/strict";
import test from "node:test";
import { evaluateDeployment, EXPECTED_GITHUB_ORG, EXPECTED_GITHUB_REPO } from "./production-drift-guard.mjs";

function deployment(overrides = {}) {
  return {
    meta: {
      githubCommitSha: "f07db04",
      githubOrg: EXPECTED_GITHUB_ORG,
      githubRepo: EXPECTED_GITHUB_REPO,
      ...overrides,
    },
  };
}

test("passes when production is the current head and no baseline yet", () => {
  const result = evaluateDeployment(deployment(), { headSha: "f07db04", baselineSha: null });
  assert.equal(result.ok, true);
  assert.equal(result.prodSha, "f07db04");
});

test("passes when production has moved forward of the baseline", () => {
  const result = evaluateDeployment(deployment({ githubCommitSha: "b2" }), {
    headSha: "b2",
    baselineSha: "a1",
    isAncestor: (ancestor, descendant) => ancestor === "a1" && descendant === "b2",
  });
  assert.equal(result.ok, true);
});

test("flags a rollback behind the last verified commit", () => {
  const result = evaluateDeployment(deployment({ githubCommitSha: "a1" }), {
    headSha: "b2",
    baselineSha: "b2",
    isAncestor: (ancestor, descendant) => ancestor === "a1" && descendant === "b2",
  });
  assert.equal(result.ok, false);
  assert.match(result.problems[0], /rolled back/);
});

test("flags a commit that isn't in main's history at all", () => {
  const result = evaluateDeployment(deployment({ githubCommitSha: "deadbeef" }), {
    headSha: "b2",
    baselineSha: null,
    isAncestor: () => false,
  });
  assert.equal(result.ok, false);
  assert.match(result.problems[0], /not in main's history/);
});

test("flags a deployment built from the wrong repo", () => {
  const result = evaluateDeployment(deployment({ githubOrg: "copperlang2007" }), {
    headSha: "f07db04",
    baselineSha: null,
  });
  assert.equal(result.ok, false);
  assert.match(result.problems[0], /wrong Vercel project/);
});

test("flags a deployment with no commit metadata", () => {
  const result = evaluateDeployment({ meta: {} }, { headSha: "f07db04", baselineSha: null });
  assert.equal(result.ok, false);
  assert.equal(result.prodSha, null);
});
