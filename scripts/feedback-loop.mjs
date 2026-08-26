/**
 * Sanitize events for the BRIDGEt training loop.
 * Safe Harbor / aggregation only. Drop anything that looks like an identifier.
 */

import { containsForbiddenId } from "./commercial-guard.mjs";

export const FEEDBACK_EVENTS = [
  "page_view",
  "widget_open",
  "widget_cta",
  "audit_complete",
  "lead_kind",
];

const PATHS = new Set([
  "/",
  "/bridget",
  "/compare",
  "/contact",
  "/lead",
  "/medicare-basics",
  "/needs-analysis",
  "/privacy",
  "/hipaa",
  "/glba",
  "/security",
  "/terms",
  "/ai-disclosure",
  "/accessibility",
]);

const AUDIT_ENUMS = {
  coverageNow: ["original", "advantage", "medigap", "unsure"],
  keepDoctors: ["yes", "no", "unsure"],
  travel: ["yes", "no", "unsure"],
  drugs: ["light", "moderate", "heavy"],
  extras: ["yes", "no", "unsure"],
  cost: ["premium", "predictable", "unsure"],
  medicaid: ["yes", "no", "unsure"],
  facility: ["yes", "no", "unsure"],
};

const EMAIL_IN_TEXT = /[^\s@]+@[^\s@]+\.[^\s@]{2,}/;
const PHONE_IN_TEXT = /\b(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;

const slots = new Map();

export function takeFeedbackSlot(key, { now = Date.now(), windowMs = 10 * 60 * 1000, max = 80 } = {}) {
  const row = slots.get(key);
  if (!row || now - row.start > windowMs) {
    slots.set(key, { start: now, count: 1 });
    return { ok: true };
  }
  if (row.count >= max) return { ok: false };
  row.count += 1;
  return { ok: true };
}

export function sanitizePath(value) {
  const raw = String(value ?? "").split("?")[0].split("#")[0];
  const path = raw === "" ? "/" : raw.replace(/\/+$/, "") || "/";
  if (path.length > 80) return "";
  if (!PATHS.has(path)) return "";
  return path;
}

function looksIdentifying(value) {
  const text = String(value ?? "");
  if (!text) return false;
  if (containsForbiddenId(text)) return true;
  if (EMAIL_IN_TEXT.test(text) || PHONE_IN_TEXT.test(text)) return true;
  return false;
}

export function sanitizeFeedback(input) {
  const event = FEEDBACK_EVENTS.includes(input?.event) ? input.event : "";
  const path = sanitizePath(input?.path);
  if (!event || !path) return { ok: false, error: "drop" };

  const raw = input?.payload && typeof input.payload === "object" ? input.payload : {};
  let payload = {};

  if (event === "widget_cta") {
    const cta = String(raw.cta ?? "");
    if (!["talk", "call", "callback"].includes(cta)) return { ok: false, error: "drop" };
    payload = { cta };
  } else if (event === "lead_kind") {
    const kind = raw.kind === "needs" ? "needs" : "callback";
    payload = { kind };
  } else if (event === "audit_complete") {
    for (const [key, allowed] of Object.entries(AUDIT_ENUMS)) {
      const value = String(raw[key] ?? "");
      if (!allowed.includes(value)) return { ok: false, error: "drop" };
      payload[key] = value;
    }
  }

  const blob = `${event} ${path} ${JSON.stringify(payload)}`;
  if (looksIdentifying(blob)) return { ok: false, error: "drop" };

  return { ok: true, data: { event, path, payload } };
}
