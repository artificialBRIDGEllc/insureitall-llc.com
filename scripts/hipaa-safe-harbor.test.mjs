import assert from "node:assert/strict";
import {
  SAFE_HARBOR_IDENTIFIERS,
  safeHarborRedact,
  safeHarborText,
} from "./hipaa-safe-harbor.mjs";

assert.equal(SAFE_HARBOR_IDENTIFIERS.length, 18);

const t = (input) => safeHarborText(input);

assert.match(t("My name is Jane Doe and I take Eliquis."), /\[name\]/);
assert.match(t("My name is Jane Doe and I take Eliquis."), /Eliquis/);
assert.match(t("I see Dr. Patel at 123 Main Street in Dallas, TX 75034."), /\[name\]/);
assert.match(t("I see Dr. Patel at 123 Main Street in Dallas, TX 75034."), /\[address\]/);
assert.match(t("I see Dr. Patel at 123 Main Street in Dallas, TX 75034."), /\[city\] TX/);
assert.match(t("I see Dr. Patel at 123 Main Street in Dallas, TX 75034."), /750/);
assert.equal(t("I live in 75034.").includes("75034"), false);
assert.match(t("ZIP 03601 is tiny."), /\[zip\]/);
assert.match(t("Call 214-555-0199."), /\[phone\]/);
assert.match(t("Fax 214-555-0100 please."), /\[fax\]/);
assert.match(t("Email me at jane@example.com"), /\[email\]/);
assert.match(t("SSN 111-11-1111"), /\[ssn\]/);
assert.match(t("MRN 445566"), /\[mrn\]/);
assert.match(t("Member ID ABC123456"), /\[mbi\]/);
assert.match(t("Account number 99887766"), /\[account\]/);
assert.match(t("NPI 1234567890"), /\[license\]/);
assert.match(t("Plate ABC1234"), /\[vehicle\]/);
assert.match(t("Serial 7X99AA11"), /\[device\]/);
assert.match(t("See https://example.com/plan"), /\[url\]/);
assert.match(t("IP 192.168.1.20"), /\[ip\]/);
assert.match(t("Voiceprint on file"), /\[bio\]/);
assert.match(t("A photograph of my face"), /\[photo\]/);
assert.match(t("Born March 4 2020"), /2020/);
assert.equal(t("Born March 4 2020").includes("March"), false);
assert.match(t("I am 92 years old"), /\[age90\+\]/);
assert.equal(safeHarborRedact("").dropped, true);

console.log("hipaa-safe-harbor.test.mjs ok");
