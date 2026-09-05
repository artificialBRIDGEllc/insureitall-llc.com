import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";
import { forwardLeadToBridget } from "@/lib/bridget-console";
// Types live in src/lib/commercial-guard.d.ts; Vite resolves the .mjs.
// @ts-expect-error -- allowJs not enabled for this workspace
import { parsePublicLead, takeLeadSlot } from "../../scripts/commercial-guard.mjs";
// @ts-expect-error -- JS alert
import { notifyTeamLead } from "../../scripts/lead-alert.mjs";

function mintId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let out = "REQ-";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

function clientKey() {
  try {
    const req = getRequest();
    const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    return forwarded || req.headers.get("cf-connecting-ip") || "local";
  } catch {
    return "local";
  }
}

/**
 * Public inbound lead capture (/lead, /needs-analysis). Staff-facing
 * management of these leads (list, advance stage, disenroll, …) now lives in
 * the BRIDGEt Console app, not this repo — see `@/lib/bridget-console` and
 * `docs/`. This still writes to the local `ops_requests` table (email/webhook
 * alerts and the legacy share-code lookup in `src/lib/portal.ts` depend on
 * it — that lookup is currently unmounted, not gone; see CLAUDE.md) and,
 * best-effort, forwards the same lead to BRIDGEt so it shows up in the staff
 * desk.
 */
export const submitOpsRequest = createServerFn({ method: "POST" })
  .validator((input: {
    kind: "callback" | "needs";
    firstName?: string;
    phone?: string;
    email?: string;
    zip?: string;
    callbackWindow?: string;
    doctors?: string;
    medications?: string;
    budget?: string;
    notes?: string;
    consent?: boolean;
    website?: string;
  }) => input)
  .handler(async ({ data }) => {
    const parsed = parsePublicLead(data as Record<string, unknown>);
    if (!parsed.ok) {
      throw new Error(parsed.error);
    }
    if ("ignored" in parsed && parsed.ignored) {
      return { id: "REQ-OK" };
    }
    const slot = takeLeadSlot(clientKey());
    if (!slot.ok) {
      throw new Error(slot.error);
    }
    const sql = await getSql();
    const id = mintId();
    const row = parsed.data;
    const source = row.kind === "needs" ? "Needs analysis" : "Callback form";
    await sql`
      insert into ops_requests (
        id, kind, first_name, phone, email, zip, callback_window,
        doctors, medications, budget, notes, source, consent_at, stage
      ) values (
        ${id}, ${row.kind}, ${row.firstName}, ${row.phone}, ${row.email},
        ${row.zip}, ${row.callbackWindow}, ${row.doctors}, ${row.medications},
        ${row.budget}, ${row.notes}, ${source}, now(), ${"new"}
      )
    `;
    try {
      await sql`
        insert into lead_events (lead_id, stage, note, actor)
        values (${id}, ${"new"}, ${"Inbound from public site"}, ${"site"})
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
      /* Lead is saved. Alert must not fail the consumer. */
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
      /* Lead is saved locally. BRIDGEt sync must not fail the consumer. */
    }
    return { id };
  });
