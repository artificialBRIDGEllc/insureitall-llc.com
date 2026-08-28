import assert from "node:assert/strict";
import test from "node:test";
import { validateEnv } from "./env-validate.mjs";

test("empty env is valid in preview", () => {
  const report = validateEnv({}, { production: false });
  assert.equal(report.ok, true);
  assert.equal(report.channels.resend, "missing");
  assert.equal(report.channels.webhook, "missing");
});

test("rejects a Resend key that is not re_", () => {
  const report = validateEnv({ RESEND_API_KEY: "sk-live" }, { production: false });
  assert.equal(report.ok, false);
  assert.equal(report.errors[0].key, "RESEND_API_KEY");
  assert.equal(JSON.stringify(report).includes("sk-live"), false);
});

test("Resend cluster without a key is an error", () => {
  const report = validateEnv(
    { LEAD_ALERT_FROM: "INSUREitALL <alerts@insureitall-llc.com>" },
    { production: false },
  );
  assert.equal(report.ok, false);
  assert.match(report.errors[0].message, /LEAD_ALERT_FROM/);
});

test("valid Resend cluster passes", () => {
  const report = validateEnv(
    {
      RESEND_API_KEY: "re_test",
      LEAD_ALERT_FROM: "INSUREitALL <alerts@insureitall-llc.com>",
      LEAD_ALERT_TO: "info@team-iia.com",
      RESEND_TEMPLATE_LEAD_ALERT: "insureitall-lead-alert",
      EMAIL_PHONE: "+1 888-459-4842",
      EMAIL_CONSOLE_URL: "https://insureitall-llc.com/console",
      LEAD_RECEIPT: "1",
    },
    { production: true },
  );
  assert.equal(report.ok, true);
  assert.equal(report.channels.resend, "ok");
});

test("bad webhook and bad phone fail", () => {
  const report = validateEnv(
    {
      LEAD_ALERT_WEBHOOK: "http://insecure.example/hook",
      EMAIL_PHONE: "call-me",
      RESEND_API_KEY: "re_test",
    },
    { production: false },
  );
  assert.equal(report.ok, false);
  const keys = report.errors.map((e) => e.key).sort();
  assert.deepEqual(keys, ["EMAIL_PHONE", "LEAD_ALERT_WEBHOOK"]);
});

test("production without an alert channel warns", () => {
  const report = validateEnv({}, { production: true });
  assert.equal(report.ok, true);
  assert.ok(report.warnings.some((w) => w.key === "LEAD_ALERT_WEBHOOK"));
  assert.ok(report.warnings.some((w) => w.key === "DATABASE_URL"));
});
