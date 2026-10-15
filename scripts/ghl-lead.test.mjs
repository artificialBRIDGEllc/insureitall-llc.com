import assert from "node:assert/strict";
import test from "node:test";
import { ghlContactPayload, syncLeadToGhl } from "./ghl-lead.mjs";
import { validateEnv } from "./env-validate.mjs";

const env = { GHL_API_KEY: "pit-aaaaaaaaaaaaaaaaaaaa", GHL_LOCATION_ID: "loc1234567890abcdef" };
const lead = {
  id: "REQ-ABC",
  kind: "needs",
  firstName: "Pat",
  phone: "+18884594842",
  email: "pat@example.com",
  zip: "75078",
  callbackWindow: "Afternoon",
  doctors: "Dr. Secret",
  medications: "lisinopril",
  budget: "$50",
  notes: "private note",
  consent: true,
  source: "Needs analysis",
};

test("payload carries contact fields and never health-adjacent fields", () => {
  const body = ghlContactPayload(lead, "loc1");
  const blob = JSON.stringify(body);
  assert.equal(body.locationId, "loc1");
  assert.equal(body.firstName, "Pat");
  assert.equal(body.postalCode, "75078");
  assert.deepEqual(body.tags, ["website-lead", "needs-analysis", "tcpa-consent"]);
  for (const secret of ["Dr. Secret", "lisinopril", "$50", "private note"]) {
    assert.equal(blob.includes(secret), false);
  }
});

test("no-ops without config and never calls fetch", async () => {
  const r = await syncLeadToGhl(lead, {}, async () => {
    throw new Error("should not fetch");
  });
  assert.deepEqual(r, { sent: false, reason: "not-configured" });
});

test("upserts the contact, then adds a non-PHI note", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ contact: { id: "c1" } }), { status: 200 });
  };
  const r = await syncLeadToGhl(lead, env, fetchImpl);
  assert.equal(r.sent, true);
  assert.equal(r.contactId, "c1");
  assert.match(calls[0].url, /\/contacts\/upsert$/);
  assert.equal(calls[0].init.headers.authorization, `Bearer ${env.GHL_API_KEY}`);
  assert.equal(calls[0].init.headers.version, "2021-07-28");
  assert.match(calls[1].url, /\/contacts\/c1\/notes$/);
  assert.equal(calls[1].init.body.includes("lisinopril"), false);
});

test("retries once on 5xx, then reports a reason code only", async () => {
  let n = 0;
  const r = await syncLeadToGhl(lead, env, async () => {
    n++;
    return new Response("pat@example.com exploded", { status: 503 });
  });
  assert.equal(n, 2);
  assert.deepEqual(r, { sent: false, reason: "http-503" });
});

test("does not retry a 4xx", async () => {
  let n = 0;
  const r = await syncLeadToGhl(lead, env, async () => {
    n++;
    return new Response("{}", { status: 401 });
  });
  assert.equal(n, 1);
  assert.equal(r.reason, "http-401");
});

test("network failure is swallowed into a reason", async () => {
  const r = await syncLeadToGhl(lead, env, async () => {
    throw new Error("boom");
  });
  assert.deepEqual(r, { sent: false, reason: "network" });
});

test("env: half-configured GHL is an error, both unset is silent", () => {
  assert.equal(validateEnv({}, { production: true }).errors.some((e) => e.key.startsWith("GHL_")), false);
  assert.equal(validateEnv({}, { production: true }).warnings.some((w) => w.key.startsWith("GHL_")), false);
  const half = validateEnv({ GHL_API_KEY: env.GHL_API_KEY });
  assert.equal(half.ok, false);
  assert.equal(half.errors[0].key, "GHL_LOCATION_ID");
  assert.equal(validateEnv(env).channels.ghl, "ok");
});
