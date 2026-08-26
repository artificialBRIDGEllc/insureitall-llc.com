/**
 * Validate INSUREitALL env. Never log secret values.
 *
 *   node scripts/env-validate.mjs
 *   node scripts/env-validate.mjs --strict-production
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const HTTPS_RE = /^https:\/\/[^\s/$.?#].[^\s]*$/i;
const RESEND_KEY_RE = /^re_[A-Za-z0-9_]{2,}$/;
const TEMPLATE_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{1,80}$/;
const FROM_RE = /^(?:([^<>@\n]{1,80})\s*)?<([^<>\s]+@[^<>\s]+)>$|^([^\s@]+@[^\s@]+\.[^\s@]+)$/;

export const ENV_SCHEMA = [
  { key: "DATABASE_URL", group: "data", format: "postgres", when: "if-set" },
  { key: "RESEND_API_KEY", group: "resend", format: "resend-key", when: "cluster" },
  { key: "LEAD_ALERT_FROM", group: "resend", format: "from", when: "if-set" },
  { key: "LEAD_ALERT_TO", group: "resend", format: "email", when: "if-set" },
  { key: "LEAD_ALERT_WEBHOOK", group: "alert", format: "https", when: "if-set" },
  { key: "RESEND_TEMPLATE_LEAD_ALERT", group: "resend", format: "template", when: "if-set" },
  { key: "RESEND_TEMPLATE_LEAD_RECEIVED", group: "resend", format: "template", when: "if-set" },
  { key: "LEAD_RECEIPT", group: "resend", format: "flag", when: "if-set" },
  { key: "EMAIL_SITE_NAME", group: "copy", format: "short", when: "if-set" },
  { key: "EMAIL_PHONE", group: "copy", format: "phone", when: "if-set" },
  { key: "EMAIL_HOURS", group: "copy", format: "short", when: "if-set" },
  { key: "EMAIL_CONSOLE_URL", group: "copy", format: "https", when: "if-set" },
  { key: "EMAIL_DESK_CTA", group: "copy", format: "short", when: "if-set" },
  { key: "EMAIL_CALL_CTA", group: "copy", format: "short", when: "if-set" },
  { key: "EMAIL_RECEIVED_TITLE", group: "copy", format: "short", when: "if-set" },
  { key: "EMAIL_RECEIVED_BODY", group: "copy", format: "long", when: "if-set" },
];

const RESEND_CLUSTER = [
  "LEAD_ALERT_FROM",
  "LEAD_ALERT_TO",
  "RESEND_TEMPLATE_LEAD_ALERT",
  "RESEND_TEMPLATE_LEAD_RECEIVED",
  "LEAD_RECEIPT",
  "EMAIL_SITE_NAME",
  "EMAIL_PHONE",
  "EMAIL_HOURS",
  "EMAIL_CONSOLE_URL",
  "EMAIL_DESK_CTA",
  "EMAIL_CALL_CTA",
  "EMAIL_RECEIVED_TITLE",
  "EMAIL_RECEIVED_BODY",
];

function trim(env, key) {
  return String(env[key] ?? "").trim();
}

function validFrom(value) {
  const m = value.match(FROM_RE);
  if (!m) return false;
  const email = m[2] || m[3];
  return EMAIL_RE.test(email);
}

function validPhone(value) {
  const d = value.replace(/\D/g, "");
  return d.length === 10 || (d.length === 11 && d.startsWith("1"));
}

function validPostgres(value) {
  return /^(postgres|postgresql)(\+.+)?:\/\//i.test(value);
}

function checkFormat(format, value) {
  switch (format) {
    case "email":
      return EMAIL_RE.test(value) ? null : "must be an email address";
    case "from":
      return validFrom(value) ? null : "must be an email or Name <email@domain>";
    case "https":
      return HTTPS_RE.test(value) ? null : "must be an https URL";
    case "resend-key":
      return RESEND_KEY_RE.test(value) ? null : "must start with re_";
    case "template":
      return TEMPLATE_RE.test(value) ? null : "must be a Resend alias or tmpl_ id";
    case "flag":
      return value === "0" || value === "1" ? null : "must be 0 or 1";
    case "phone":
      return validPhone(value) ? null : "must be a 10-digit US phone";
    case "short":
      return value.length <= 80 ? null : "must be 80 characters or fewer";
    case "long":
      return value.length <= 400 ? null : "must be 400 characters or fewer";
    case "postgres":
      return validPostgres(value) ? null : "must be a postgres:// URL";
    default:
      return null;
  }
}

export function isProduction(env = {}) {
  return trim(env, "VERCEL_ENV") === "production" || trim(env, "INSUREITALL_ENV") === "production";
}

export function validateEnv(env = {}, { production = isProduction(env) } = {}) {
  const errors = [];
  const warnings = [];

  for (const field of ENV_SCHEMA) {
    const value = trim(env, field.key);
    if (!value) continue;
    const problem = checkFormat(field.format, value);
    if (problem) errors.push({ key: field.key, message: problem });
  }

  const key = trim(env, "RESEND_API_KEY");
  const clusterSet = RESEND_CLUSTER.filter((k) => trim(env, k));
  if (clusterSet.length && !key) {
    errors.push({
      key: "RESEND_API_KEY",
      message: `required because ${clusterSet[0]} is set`,
    });
  }
  if (key && !trim(env, "LEAD_ALERT_FROM")) {
    warnings.push({
      key: "LEAD_ALERT_FROM",
      message: "should be a verified Resend from-address; using the default",
    });
  }

  const webhook = trim(env, "LEAD_ALERT_WEBHOOK");
  const resendGroupError = errors.some((e) => {
    const field = ENV_SCHEMA.find((s) => s.key === e.key);
    return field?.group === "resend";
  });
  const webhookOk = Boolean(webhook) && !errors.some((e) => e.key === "LEAD_ALERT_WEBHOOK");
  const resendOk = Boolean(key) && !resendGroupError;

  if (production && !webhookOk && !resendOk) {
    warnings.push({
      key: "LEAD_ALERT_WEBHOOK",
      message: "production has no lead-alert channel (webhook or Resend)",
    });
  }
  if (production && !trim(env, "DATABASE_URL")) {
    warnings.push({
      key: "DATABASE_URL",
      message: "production should set DATABASE_URL so leads persist",
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    channels: {
      resend: !key ? "missing" : resendOk ? "ok" : "invalid",
      webhook: !webhook ? "missing" : webhookOk ? "ok" : "invalid",
    },
  };
}

export function formatReport(report) {
  const lines = [];
  for (const item of report.errors) lines.push(`error  ${item.key}: ${item.message}`);
  for (const item of report.warnings) lines.push(`warn   ${item.key}: ${item.message}`);
  if (!lines.length) lines.push("ok     env is valid");
  return lines.join("\n");
}

const isMain = process.argv[1] && process.argv[1].endsWith("env-validate.mjs");
if (isMain) {
  const report = validateEnv(process.env);
  console.log(formatReport(report));
  const strict = process.argv.includes("--strict-production");
  const fail = !report.ok || (strict && report.warnings.length);
  process.exit(fail ? 1 : 0);
}
