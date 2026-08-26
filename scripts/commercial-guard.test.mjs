import assert from "node:assert/strict";
import { test } from "node:test";
import {
  containsForbiddenId,
  parsePublicLead,
  resetLeadSlots,
  takeLeadSlot,
  validEmail,
  validPhone,
  validZip,
} from "./commercial-guard.mjs";

test("accepts common US phone formats", () => {
  assert.equal(validPhone("888-459-4842"), true);
  assert.equal(validPhone("(888) 459-4842"), true);
  assert.equal(validPhone("+1 888 459 4842"), true);
  assert.equal(validPhone("123"), false);
});

test("email and zip", () => {
  assert.equal(validEmail("info@team-iia.com"), true);
  assert.equal(validEmail("not-an-email"), false);
  assert.equal(validZip("33618"), true);
  assert.equal(validZip("33618-1234"), true);
  assert.equal(validZip("abc"), false);
  assert.equal(validZip(""), true);
});

test("callback requires consent, name, phone, email", () => {
  const noConsent = parsePublicLead({
    kind: "callback",
    firstName: "Pat",
    phone: "8884594842",
    email: "pat@example.com",
    consent: false,
  });
  assert.equal(noConsent.ok, false);

  const ok = parsePublicLead({
    kind: "callback",
    firstName: "Pat",
    phone: "(888) 459-4842",
    email: "pat@example.com",
    consent: true,
  });
  assert.equal(ok.ok, true);
  if (ok.ok && "data" in ok) {
    assert.equal(ok.data.phone, "+18884594842");
  }
});

test("honeypot is silently ignored", () => {
  const out = parsePublicLead({
    kind: "callback",
    firstName: "Bot",
    phone: "8884594842",
    email: "bot@example.com",
    consent: true,
    website: "https://spam.test",
  });
  assert.equal(out.ok, true);
  assert.equal("ignored" in out && out.ignored, true);
});

test("needs analysis requires a real zip", () => {
  const bad = parsePublicLead({
    kind: "needs",
    phone: "8884594842",
    email: "pat@example.com",
    zip: "nope",
    consent: true,
  });
  assert.equal(bad.ok, false);
  const good = parsePublicLead({
    kind: "needs",
    phone: "8884594842",
    email: "pat@example.com",
    zip: "75078",
    consent: true,
  });
  assert.equal(good.ok, true);
});

test("rate limit trips on the 9th hit in an hour", () => {
  resetLeadSlots();
  for (let i = 0; i < 8; i += 1) {
    const slot = takeLeadSlot("1.1.1.1", { now: 1_000 });
    assert.equal(slot.ok, true);
  }
  const blocked = takeLeadSlot("1.1.1.1", { now: 1_000 });
  assert.equal(blocked.ok, false);
  if (!blocked.ok) assert.equal(blocked.status, 429);
  const other = takeLeadSlot("2.2.2.2", { now: 1_000 });
  assert.equal(other.ok, true);
});

test("SSN and Medicare numbers are rejected in free text", () => {
  assert.equal(containsForbiddenId("metformin, lisinopril"), false);
  assert.equal(containsForbiddenId("Dr. Elena Vasquez"), false);
  assert.equal(containsForbiddenId("SSN 123-45-6789"), true);
  assert.equal(containsForbiddenId("1EG4TE5MK73"), true);
  assert.equal(containsForbiddenId("1EG4-TE5-MK73"), true);
  const bad = parsePublicLead({
    kind: "needs",
    phone: "8884594842",
    email: "pat@example.com",
    zip: "75078",
    medications: "123-45-6789",
    consent: true,
  });
  assert.equal(bad.ok, false);
});

