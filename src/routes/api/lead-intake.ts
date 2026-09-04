import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { forwardLeadToBridget } from "@/lib/bridget-console";
// Types live in src/lib/commercial-guard.d.ts; Vite resolves the .mjs.
// @ts-expect-error -- allowJs not enabled for this workspace
import { parsePublicLead } from "../../../scripts/commercial-guard.mjs";
// @ts-expect-error -- JS alert
import { notifyTeamLead } from "../../../scripts/lead-alert.mjs";

/**
 * GoHighLevel -> BRIDGEt lead intake.
 *
 * The GHL form is NOT replaced. GHL fires an outbound webhook on submit and
 * this route runs the same pipeline `submitOpsRequest` (src/lib/ops.ts) runs
 * for native /lead and /needs-analysis submissions:
 *
 *   ops_requests insert -> lead_events 'new' -> notifyTeamLead -> forwardLeadToBridget
 *
 * GHL therefore stays the system of record for nurture while BRIDGEt gets the
 * same journey event the native forms already produce. No corpus schema is
 * added; this reuses `ops_requests` + `lead_events` as they already exist.
 *
 * SHIPS DARK. Returns 503 until LEAD_INTAKE_ENABLED is set to "1" on Vercel.
 * See docs/decisions/ADR-0011-ghl-lead-intake-webhook.md.
 */

/** Dynamic lookup so Vite cannot inline `undefined` at build time. */
function readEnv(...names: string[]) {
  const env =
    typeof process !== "undefined" && process.env
      ? (process.env as Record<string, string | undefined>)
      : {};
  for (const name of names) {
    const value = String(env[name] ?? "").trim();
    if (value) return value;
  }
  return "";
}

/** Length-independent comparison so a wrong secret leaks no timing signal. */
function secretMatches(supplied: string, expected: string) {
  if (!expected) return false;
  const a = new TextEncoder().encode(supplied);
  const b = new TextEncoder().encode(expected);
  let diff = a.length ^ b.length;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

function mintId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let out = "REQ-";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

function pick(body: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = body[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return undefined;
}

/**
 * GHL field names vary by form configuration. This mapper is deliberately
 * tolerant and reads several candidate keys per field. Confirm against a real
 * captured payload before enabling — see the ADR's cutover steps.
 */
function mapGhlPayload(raw: Record<string, unknown>) {
  const custom =
    raw.customData && typeof raw.customData === "object"
      ? (raw.customData as Record<string, unknown>)
      : {};
  const body: Record<string, unknown> = { ...custom, ...raw };

  const firstName =
    pick(body, "first_name", "firstName", "contact_first_name") ??
    pick(body, "full_name", "fullName", "name")?.split(/\s+/)[0];

  return {
    externalId: pick(
      body,
      "contact_id",
      "contactId",
      "id",
      "submission_id",
      "submissionId",
    ),
    lead: {
      kind: "callback" as const,
      firstName,
      phone: pick(body, "phone", "phone_number", "phoneNumber"),
      email: pick(body, "email", "email_address"),
      zip: pick(body, "postal_code", "postalCode", "zip", "zip_code", "zipCode"),
      callbackWindow: pick(
        body,
        "callback_window",
        "callbackWindow",
        "best_time_to_call",
        "preferred_time",
      ),
      doctors: pick(body, "doctors", "your_doctors", "providers"),
      medications: pick(body, "medications", "prescriptions", "your_medications"),
      budget: pick(body, "budget", "monthly_budget"),
      notes: pick(body, "notes", "message", "comments", "how_can_we_help"),
      consent: true,
    },
  };
}

export const Route = createFileRoute("/api/lead-intake")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. Kill switch. Dark until explicitly enabled on Vercel.
        if (readEnv("LEAD_INTAKE_ENABLED") !== "1") {
          return Response.json(
            { ok: false, error: "intake_disabled" },
            { status: 503 },
          );
        }

        // 2. Shared secret. GHL sends it as a custom header on the webhook.
        const expected = readEnv("LEAD_INTAKE_SECRET");
        const supplied =
          request.headers.get("x-iia-intake-secret") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
          "";
        if (!secretMatches(supplied, expected)) {
          return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
        }

        let raw: Record<string, unknown>;
        try {
          raw = (await request.json()) as Record<string, unknown>;
        } catch {
          return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
        }

        const { externalId, lead } = mapGhlPayload(raw);

        // 3. Same validator the native forms use. Keeps one definition of a
        //    valid lead rather than a second, drifting one.
        const parsed = parsePublicLead(lead as Record<string, unknown>);
        if (!parsed.ok) {
          // Never echo the payload back — it carries PII.
          return Response.json(
            { ok: false, error: "invalid_lead", detail: parsed.error },
            { status: 422 },
          );
        }
        if ("ignored" in parsed && parsed.ignored) {
          return Response.json({ ok: true, ignored: true });
        }

        // NOTE: takeLeadSlot() is deliberately NOT applied here. It buckets by
        // client IP, and every GHL webhook arrives from the same small set of
        // IPs — it would throttle legitimate traffic to near zero. The shared
        // secret plus the external_id uniqueness constraint are the controls
        // on this route instead. See ADR-0011.

        const sql = await getSql();
        const row = parsed.data;
        const id = mintId();
        const source = "GoHighLevel form";

        // 4. Idempotent insert. GHL retries webhooks on non-2xx, so a repeat
        //    delivery must not create a second lead.
        const inserted = await sql`
          insert into ops_requests (
            id, kind, first_name, phone, email, zip, callback_window,
            doctors, medications, budget, notes, disposition, source,
            consent_at, stage, external_id
          ) values (
            ${id}, ${row.kind}, ${row.firstName}, ${row.phone}, ${row.email},
            ${row.zip}, ${row.callbackWindow}, ${row.doctors}, ${row.medications},
            ${row.budget}, ${row.notes}, ${"new"}, ${source}, now(), ${"new"},
            ${externalId ?? null}
          )
          on conflict (external_id) do nothing
          returning id
        `;

        if (!inserted?.length) {
          // Already have this submission. Return 200 so GHL stops retrying.
          return Response.json({ ok: true, duplicate: true });
        }

        try {
          await sql`
            insert into lead_events (lead_id, stage, note, actor)
            values (${id}, ${"new"}, ${"Inbound from GoHighLevel form"}, ${"ghl"})
          `;
        } catch {
          /* lifecycle table may not be applied yet */
        }

        try {
          await notifyTeamLead({
            id,
            kind: row.kind,
            firstName: row.firstName,
            phone: row.phone,
            email: row.email,
            zip: row.zip,
            callbackWindow: row.callbackWindow,
          });
        } catch {
          /* Lead is saved. Alert must not fail the webhook. */
        }

        try {
          await forwardLeadToBridget({
            externalId: id,
            kind: row.kind,
            firstName: row.firstName,
            phone: row.phone,
            email: row.email,
            zip: row.zip,
            callbackWindow: row.callbackWindow,
            doctors: row.doctors,
            medications: row.medications,
            budget: row.budget,
            notes: row.notes,
            source,
            consent: row.consent,
          });
        } catch {
          /* Lead is saved locally. BRIDGEt sync must not fail the webhook. */
        }

        return Response.json({ ok: true, id });
      },
    },
  },
});