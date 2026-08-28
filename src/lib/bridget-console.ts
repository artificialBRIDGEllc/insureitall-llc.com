/**
 * The BRIDGEt Console app is a separate product (multi-tenant, auth scoped
 * per tenant — see github.com/copperlang2007/BRIDGEt). This repo no longer
 * owns the staff desk; it only points at BRIDGEt and forwards inbound leads
 * to it.
 *
 * `VITE_BRIDGET_CONSOLE_URL` — origin of the deployed BRIDGEt app, e.g.
 *   https://bridget-console.example.com
 * `BRIDGET_TENANT_SLUG` — this site's tenant slug in BRIDGEt (defaults to
 *   "insureitall", matching the tenant BRIDGEt's own seed migration creates).
 * `BRIDGET_INGEST_API_KEY` — server-only. A tenant API key minted from
 *   BRIDGEt's Settings → API keys page, used to authenticate the forwarded
 *   lead POST. Leads are not forwarded (silently, not an error) when unset.
 */

const env = (key: string): string | undefined => {
  const value = (import.meta.env as Record<string, string | undefined>)[key]?.trim();
  return value ? value : undefined;
};

const serverEnv = (key: string): string | undefined => {
  const value = typeof process !== "undefined" ? process.env[key]?.trim() : undefined;
  return value ? value : undefined;
};

const CONSOLE_ORIGIN = env("VITE_BRIDGET_CONSOLE_URL")?.replace(/\/+$/, "");
const TENANT_SLUG = env("VITE_BRIDGET_TENANT_SLUG") ?? "insureitall";

/** True once a deployed BRIDGEt origin is configured. */
export const bridgetConsoleConfigured = Boolean(CONSOLE_ORIGIN);

/** This site's staff desk inside BRIDGEt, or `null` until deployed + configured. */
export function bridgetConsoleUrl(): string | null {
  return CONSOLE_ORIGIN ? `${CONSOLE_ORIGIN}/t/${TENANT_SLUG}` : null;
}

type ForwardLead = {
  kind: string;
  firstName?: string;
  phone?: string;
  email?: string;
  zip?: string;
  callbackWindow?: string;
  doctors?: string;
  medications?: string;
  budget?: string;
  notes?: string;
  source?: string;
  consent: boolean;
};

/**
 * Best-effort, server-only: push a freshly-captured lead into BRIDGEt so it
 * shows up in the staff desk. No-ops when `BRIDGET_INGEST_API_KEY` isn't set
 * (e.g. local dev, or before the tenant key has been minted) — never throws,
 * callers should still wrap this in try/catch since a network failure must
 * not fail the consumer-facing submission.
 */
export async function forwardLeadToBridget(lead: ForwardLead): Promise<void> {
  const origin = CONSOLE_ORIGIN;
  const apiKey = serverEnv("BRIDGET_INGEST_API_KEY");
  if (!origin || !apiKey) return;

  const res = await fetch(`${origin}/api/ingest/leads`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(lead),
  });
  if (!res.ok) {
    throw new Error(`BRIDGEt ingestion responded ${res.status}`);
  }
}
