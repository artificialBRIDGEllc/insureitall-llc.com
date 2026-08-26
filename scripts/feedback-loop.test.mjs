import { sanitizeFeedback } from "./feedback-loop.mjs";
import assert from "node:assert/strict";

assert.equal(sanitizeFeedback({ event: "page_view", path: "/compare" }).ok, true);
assert.equal(sanitizeFeedback({ event: "page_view", path: "/portal" }).ok, false);
assert.equal(
  sanitizeFeedback({
    event: "lead_kind",
    path: "/lead",
    payload: { kind: "callback", email: "a@b.com" },
  }).data.payload.email,
  undefined,
);
assert.equal(
  sanitizeFeedback({
    event: "audit_complete",
    path: "/compare",
    payload: {
      coverageNow: "advantage",
      keepDoctors: "yes",
      travel: "no",
      drugs: "heavy",
      extras: "yes",
      cost: "premium",
      medicaid: "no",
      facility: "no",
    },
  }).ok,
  true,
);
assert.equal(
  sanitizeFeedback({
    event: "audit_complete",
    path: "/compare",
    payload: { coverageNow: "ssn 111-11-1111" },
  }).ok,
  false,
);
console.log("feedback-loop.test.mjs ok");
