import { redactTranscript, sanitizeFeedback } from "./feedback-loop.mjs";
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
assert.equal(
  redactTranscript("I see Dr. Patel at 123 Main Street in Dallas, TX 75034 on March 4 2024. Call 214-555-0199.").includes("[name]"),
  true,
);
assert.equal(
  redactTranscript("I see Dr. Patel at 123 Main Street in Dallas, TX 75034 on March 4 2024. Call 214-555-0199.").includes("[phone]"),
  true,
);
assert.equal(redactTranscript("My name is Jane Doe and I take Eliquis.").includes("[name]"), true);
assert.equal(redactTranscript("My name is Jane Doe and I take Eliquis.").includes("Eliquis"), true);
assert.equal(redactTranscript("SSN 111-11-1111").includes("[ssn]"), true);
assert.equal(
  sanitizeFeedback({
    event: "voice_transcript",
    path: "/bridget",
    payload: {
      turns: JSON.stringify([
        { role: "user", text: "Drug costs with Dr. Nguyen. Call 214-555-0199 in 75034." },
      ]),
    },
  }).ok,
  true,
);
console.log("feedback-loop.test.mjs ok");
