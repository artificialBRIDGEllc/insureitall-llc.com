/**
 * Team lead alert + consumer receipt.
 * Minimum necessary: never send doctors, medications, or notes.
 *
 * Env (Vercel Production):
 *   LEAD_ALERT_WEBHOOK              POST JSON (GHL / Make / Slack)
 *   RESEND_API_KEY                  send mail
 *   LEAD_ALERT_TO                   default info@team-iia.com
 *   LEAD_ALERT_FROM                 verified Resend from
 *   RESEND_TEMPLATE_LEAD_ALERT      published alias or tmpl_ id (optional)
 *   RESEND_TEMPLATE_LEAD_RECEIVED   published alias or tmpl_ id (optional)
 *   LEAD_RECEIPT                    set to 0 to skip consumer confirmation
 */

import { leadAlertTemplate, leadReceivedTemplate } from "./email-templates.mjs";
import { validateEnv } from "./env-validate.mjs";

export const LEAD_ALERT_TO_DEFAULT = "info@team-iia.com";
const TIMEOUT_MS = 2500;
const RESEND_URL = "https://api.resend.com/emails";

export function leadAlertPayload(row, { now = Date.now() } = {}) {
  return {
    source: "insureitall-website",
    id: String(row.id ?? ""),
    kind: row.kind === "needs" ? "needs" : "callback",
    firstName: String(row.firstName ?? "").slice(0, 80),
    phone: String(row.phone ?? "").slice(0, 20),
    email: String(row.email ?? "").slice(0, 120),
    zip: String(row.zip ?? "").slice(0, 16),
    callbackWindow: String(row.callbackWindow ?? "").slice(0, 40),
    receivedAt: new Date(now).toISOString(),
  };
}

export function leadAlertEmail(payload, env = {}) {
  const rendered = leadAlertTemplate(payload, env);
  return { subject: rendered.subject, text: rendered.text, html: rendered.html };
}

function withTimeout(promise, ms = TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("lead-alert timeout")), ms);
    }),
  ]);
}

function resendPayload({ from, to, rendered, templateId, replyTo }) {
  const base = { from, to: Array.isArray(to) ? to : [to] };
  if (replyTo) base.reply_to = replyTo;
  if (templateId) {
    return {
      ...base,
      template: { id: templateId, variables: rendered.variables },
    };
  }
  return {
    ...base,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
  };
}

export async function notifyTeamLead(row, env = process.env, fetchImpl = fetch) {
  const payload = leadAlertPayload(row);
  const report = validateEnv(env);
  const webhook = String(env.LEAD_ALERT_WEBHOOK ?? "").trim();
  const key = String(env.RESEND_API_KEY ?? "").trim();
  const webhookOk = report.channels.webhook === "ok";
  const resendOk = report.channels.resend === "ok";
  const to = String(env.LEAD_ALERT_TO ?? "").trim() || LEAD_ALERT_TO_DEFAULT;
  const from =
    String(env.LEAD_ALERT_FROM ?? "").trim() || "INSUREitALL <info@team-iia.com>";
  const receiptOff = String(env.LEAD_RECEIPT ?? "").trim() === "0";
  const alertTpl = String(env.RESEND_TEMPLATE_LEAD_ALERT ?? "").trim();
  const receivedTpl = String(env.RESEND_TEMPLATE_LEAD_RECEIVED ?? "").trim();

  const jobs = [];
  const headers = {
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
  };

  if (webhookOk) {
    jobs.push(
      withTimeout(
        fetchImpl(webhook, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        }),
      ),
    );
  }

  if (resendOk) {
    const team = leadAlertTemplate(payload, env);
    jobs.push(
      withTimeout(
        fetchImpl(RESEND_URL, {
          method: "POST",
          headers,
          body: JSON.stringify(
            resendPayload({ from, to, rendered: team, templateId: alertTpl }),
          ),
        }),
      ),
    );

    if (!receiptOff && payload.email) {
      const received = leadReceivedTemplate(payload, env);
      jobs.push(
        withTimeout(
          fetchImpl(RESEND_URL, {
            method: "POST",
            headers,
            body: JSON.stringify(
              resendPayload({
                from,
                to: payload.email,
                rendered: received,
                templateId: receivedTpl,
                replyTo: to,
              }),
            ),
          }),
        ),
      );
    }
  }

  if (!jobs.length) {
    return { sent: false, reason: "not-configured" };
  }

  const results = await Promise.allSettled(jobs);
  const ok = results.some((r) => r.status === "fulfilled");
  return {
    sent: ok,
    webhook: webhookOk,
    email: resendOk,
    receipt: Boolean(resendOk && !receiptOff && payload.email),
    env: report.ok ? "ok" : "invalid",
  };
}
