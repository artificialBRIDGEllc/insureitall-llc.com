/**
 * Public-form guards used by submitOpsRequest.
 * Phone / email / zip, TCPA consent, honeypot, per-IP rate limit.
 */

const PHONE_RE = /^(\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const ZIP_RE = /^\d{5}(?:-\d{4})?$/;

const SSN_RE = /\b\d{3}-\d{2}-\d{4}\b/;
/** CMS MBI: 11 chars, optional dashes after 4 and 7. */
const MBI_RE =
  /\b[1-9][AC-HJKMNPQRTUVWXY][AC-HJKMNPQRTUVWXY0-9][0-9][AC-HJKMNPQRTUVWXY][AC-HJKMNPQRTUVWXY0-9][0-9][AC-HJKMNPQRTUVWXY]{2}[0-9]{2}\b/i;
const FORBIDDEN_PHRASE_RE =
  /\b(ssn|social security number|medicare (?:id |beneficiary )?number|mbi|red,? white,? and blue card)\b/i;

export function containsForbiddenId(value) {
  const text = String(value ?? "");
  if (!text.trim()) return false;
  const compact = text.replace(/[\s-]/g, "");
  if (SSN_RE.test(text)) return true;
  if (MBI_RE.test(text) || MBI_RE.test(compact)) return true;
  if (FORBIDDEN_PHRASE_RE.test(text)) return true;
  return false;
}

export const FORBIDDEN_ID_ERROR =
  "Do not enter a Medicare number or Social Security number. Names of doctors and medications are enough.";


export function digits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

export function normalizePhone(value) {
  const d = digits(value);
  if (d.length === 11 && d.startsWith("1")) return `+1${d.slice(1)}`;
  if (d.length === 10) return `+1${d}`;
  return "";
}

export function validPhone(value) {
  return PHONE_RE.test(String(value ?? "").trim()) && Boolean(normalizePhone(value));
}

export function validEmail(value) {
  const v = String(value ?? "").trim();
  return v.length <= 120 && EMAIL_RE.test(v);
}

export function validZip(value) {
  const v = String(value ?? "").trim();
  if (!v) return true;
  return ZIP_RE.test(v);
}

/**
 * @returns {{ ok: true, data: object } | { ok: false, error: string, status: number } | { ok: true, ignored: true }}
 */
export function parsePublicLead(input, { now = Date.now() } = {}) {
  if (String(input.website ?? "").trim()) {
    return { ok: true, ignored: true };
  }
  if (input.consent !== true) {
    return { ok: false, error: "Consent is required to request a call.", status: 400 };
  }
  const kind = input.kind === "needs" ? "needs" : "callback";
  const phone = String(input.phone ?? "").trim();
  const email = String(input.email ?? "").trim();
  const zip = String(input.zip ?? "").trim();
  if (!validPhone(phone)) {
    return { ok: false, error: "Enter a US phone number we can actually call.", status: 400 };
  }
  if (!validEmail(email)) {
    return { ok: false, error: "Enter an email we can reach you at.", status: 400 };
  }
  if (kind === "needs" && !validZip(zip)) {
    return { ok: false, error: "Enter a 5-digit US zip code.", status: 400 };
  }
  if (kind === "callback" && !String(input.firstName ?? "").trim()) {
    return { ok: false, error: "Tell us your first name.", status: 400 };
  }
  const blob = [input.firstName, input.notes, input.doctors, input.medications, input.budget]
    .map((v) => String(v ?? ""))
    .join(" ");
  if (containsForbiddenId(blob)) {
    return { ok: false, error: FORBIDDEN_ID_ERROR, status: 400 };
  }
  return {
    ok: true,
    data: {
      kind,
      firstName: String(input.firstName ?? "").trim().slice(0, 80),
      phone: normalizePhone(phone),
      email: email.slice(0, 120),
      zip: zip.slice(0, 16),
      callbackWindow: String(input.callbackWindow ?? "").trim().slice(0, 40),
      doctors: String(input.doctors ?? "").trim().slice(0, 2000),
      medications: String(input.medications ?? "").trim().slice(0, 2000),
      budget: String(input.budget ?? "").trim().slice(0, 64),
      notes: String(input.notes ?? "").trim().slice(0, 2000),
      consent: true,
      takenAt: now,
    },
  };
}

/** 8 public lead posts per hour per key. */
const windows = new Map();

export function takeLeadSlot(key, { now = Date.now(), limit = 8, windowMs = 60 * 60 * 1000 } = {}) {
  const id = String(key || "local");
  const start = now - windowMs;
  const prior = (windows.get(id) ?? []).filter((t) => t > start);
  if (prior.length >= limit) {
    return { ok: false, error: "Too many requests. Call us and we’ll take it from here.", status: 429 };
  }
  prior.push(now);
  windows.set(id, prior);
  return { ok: true, remaining: limit - prior.length };
}

export function resetLeadSlots() {
  windows.clear();
}
