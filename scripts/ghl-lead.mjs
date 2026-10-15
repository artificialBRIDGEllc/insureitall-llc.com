/**
 * Push a freshly-captured website lead into GoHighLevel as a contact.
 * Minimum necessary: never send doctors, medications, budget, or notes —
 * those are health-adjacent and GHL is not where PHI lives (see ADR-0015).
 *
 * Env (Vercel Production, server-only):
 *   GHL_API_KEY       Private Integration token (contacts.write scope)
 *   GHL_LOCATION_ID   GHL sub-account (location) id
 *
 * Uses POST /contacts/upsert, so a repeat submission by the same phone/email
 * updates the existing contact instead of creating a duplicate.
 */

export const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";
const TIMEOUT_MS = 4000;

export function ghlConfig(env = {}) {
  const apiKey = String(env.GHL_API_KEY ?? "").trim();
  const locationId = String(env.GHL_LOCATION_ID ?? "").trim();
  return apiKey && locationId ? { apiKey, locationId } : null;
}

export function ghlContactPayload(row, locationId) {
  const kind = row.kind === "needs" ? "needs" : "callback";
  const tags = ["website-lead", kind === "needs" ? "needs-analysis" : "callback-request"];
  if (row.consent) tags.push("tcpa-consent");
  const body = {
    locationId,
    source: row.source ? `INSUREitALL website - ${row.source}` : "INSUREitALL website",
    tags,
  };
  const set = (key, value, max) => {
    const v = String(value ?? "").trim().slice(0, max);
    if (v) body[key] = v;
  };
  set("firstName", row.firstName, 80);
  set("phone", row.phone, 20);
  set("email", row.email, 120);
  set("postalCode", row.zip, 16);
  return body;
}

function withTimeout(ms = TIMEOUT_MS) {
  return AbortSignal.timeout(ms);
}

async function post(fetchImpl, cfg, path, body) {
  const res = await fetchImpl(`${GHL_BASE}${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${cfg.apiKey}`,
      version: GHL_VERSION,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: withTimeout(),
  });
  return res;
}

/**
 * Returns `{ sent, reason, contactId? }`. Never throws and never includes the
 * lead or the GHL response body in the result (both can carry PII).
 */
export async function syncLeadToGhl(row, env = {}, fetchImpl = fetch) {
  const cfg = ghlConfig(env);
  if (!cfg) return { sent: false, reason: "not-configured" };
  if (!row.phone && !row.email) return { sent: false, reason: "no-contact-method" };

  let res;
  try {
    res = await post(fetchImpl, cfg, "/contacts/upsert", ghlContactPayload(row, cfg.locationId));
    // One retry for transient failures; GHL rate limits and 5xx are common.
    if (res.status === 429 || res.status >= 500) {
      res = await post(fetchImpl, cfg, "/contacts/upsert", ghlContactPayload(row, cfg.locationId));
    }
  } catch {
    return { sent: false, reason: "network" };
  }
  if (!res.ok) return { sent: false, reason: `http-${res.status}` };

  let contactId;
  try {
    const json = await res.json();
    contactId = json?.contact?.id;
  } catch {
    /* contact exists; we just cannot annotate it */
  }

  // Non-PHI context for whoever calls back. Best-effort; the contact is the
  // deliverable and already exists.
  if (contactId && (row.callbackWindow || row.id)) {
    const lines = [`Website request ${row.id ?? ""}`.trim()];
    if (row.callbackWindow) lines.push(`Best time to call: ${String(row.callbackWindow).slice(0, 40)}`);
    try {
      await post(fetchImpl, cfg, `/contacts/${encodeURIComponent(contactId)}/notes`, {
        body: lines.join("\n"),
      });
    } catch {
      /* ignore */
    }
  }
  return { sent: true, reason: "ok", contactId };
}
