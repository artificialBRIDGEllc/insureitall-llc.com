import assert from "node:assert/strict";
import test from "node:test";
import { leadAlertEmail, leadAlertPayload, notifyTeamLead } from "./lead-alert.mjs";
import { leadReceivedTemplate } from "./email-templates.mjs";

test("alert payload never includes doctors or medications", () => {
  const payload = leadAlertPayload({
    id: "REQ-ABC",
    kind: "needs",
    firstName: "Pat",
    phone: "+18884594842",
    email: "pat@example.com",
    zip: "75078",
    callbackWindow: "Afternoon",
    doctors: "Dr. Secret",
    medications: "lisinopril",
    notes: "do not email this",
  });
  const blob = JSON.stringify(payload);
  assert.equal(payload.id, "REQ-ABC");
  assert.equal(blob.includes("Dr. Secret"), false);
  assert.equal(blob.includes("lisinopril"), false);
  assert.equal(blob.includes("do not email this"), false);
});

test("email tells staff to open the desk for the file", () => {
  const { subject, text, html } = leadAlertEmail(
    leadAlertPayload({ id: "REQ-1", kind: "callback", firstName: "Pat", phone: "+18884594842" }),
  );
  assert.match(subject, /Callback/);
  assert.match(text, /\/console\/leads/);
  assert.match(html, /#0A1D3D/);
  assert.equal(text.includes("lisinopril"), false);
  assert.equal(html.includes("lisinopril"), false);
});

test("consumer receipt has no PHI and names the phone", () => {
  const mail = leadReceivedTemplate(
    leadAlertPayload({
      id: "REQ-1",
      kind: "needs",
      firstName: "Pat",
      email: "pat@example.com",
      medications: "secret",
    }),
  );
  assert.match(mail.subject, /We have your request/);
  assert.match(mail.text, /908-827-6223/);
  assert.equal(mail.html.includes("secret"), false);
  assert.equal(mail.alias, "insureitall-lead-received");
});

test("does nothing when env is empty", async () => {
  const result = await notifyTeamLead({ id: "REQ-1", kind: "callback" }, {}, async () => {
    throw new Error("should not fetch");
  });
  assert.equal(result.sent, false);
  assert.equal(result.reason, "not-configured");
});

test("posts webhook without PHI fields", async () => {
  let body = "";
  const result = await notifyTeamLead(
    { id: "REQ-2", kind: "needs", firstName: "Pat", medications: "secret" },
    { LEAD_ALERT_WEBHOOK: "https://example.test/hook" },
    async (_url, init) => {
      body = init.body;
      return { ok: true };
    },
  );
  assert.equal(result.sent, true);
  assert.equal(body.includes("secret"), false);
  assert.equal(JSON.parse(body).id, "REQ-2");
});

test("Resend sends team html and consumer receipt", async () => {
  const posts = [];
  const result = await notifyTeamLead(
    {
      id: "REQ-3",
      kind: "callback",
      firstName: "Pat",
      email: "pat@example.com",
      medications: "secret",
    },
    { RESEND_API_KEY: "re_test", LEAD_ALERT_FROM: "INSUREitALL <alerts@insureitall-llc.com>" },
    async (url, init) => {
      posts.push({ url, body: JSON.parse(init.body) });
      return { ok: true };
    },
  );
  assert.equal(result.sent, true);
  assert.equal(result.receipt, true);
  assert.equal(posts.length, 2);
  assert.equal(posts[0].url, "https://api.resend.com/emails");
  assert.equal(posts[0].body.to[0], "info@team-iia.com");
  assert.ok(posts[0].body.html.includes("#0A1D3D"));
  assert.equal(JSON.stringify(posts).includes("secret"), false);
  assert.equal(posts[1].body.to[0], "pat@example.com");
});

test("published Resend template id is used when set", async () => {
  const posts = [];
  await notifyTeamLead(
    { id: "REQ-4", kind: "callback", firstName: "Pat", email: "pat@example.com" },
    {
      RESEND_API_KEY: "re_test",
      RESEND_TEMPLATE_LEAD_ALERT: "insureitall-lead-alert",
      LEAD_RECEIPT: "0",
    },
    async (_url, init) => {
      posts.push(JSON.parse(init.body));
      return { ok: true };
    },
  );
  assert.equal(posts.length, 1);
  assert.equal(posts[0].template.id, "insureitall-lead-alert");
  assert.equal(posts[0].template.variables.ID, "REQ-4");
  assert.equal(posts[0].html, undefined);
});

test("EMAIL_* env customizes template variables", async () => {
  const posts = [];
  await notifyTeamLead(
    { id: "REQ-5", kind: "callback", firstName: "Pat", email: "pat@example.com" },
    {
      RESEND_API_KEY: "re_test",
      EMAIL_DESK_CTA: "Open Bridget Console",
      EMAIL_RECEIVED_TITLE: "You're on the list.",
      LEAD_RECEIPT: "0",
      RESEND_TEMPLATE_LEAD_ALERT: "insureitall-lead-alert",
    },
    async (_url, init) => {
      posts.push(JSON.parse(init.body));
      return { ok: true };
    },
  );
  assert.equal(posts[0].template.variables.DESK_CTA, "Open Bridget Console");
  assert.equal(posts[0].template.variables.SITE_NAME, "INSUREitALL");
});

