import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { staffMiddleware } from "@/lib/staff-middleware";
import { getSql } from "@/lib/db";
import {
  normalizeStage,
  nextStages,
  type LeadStage,
} from "@/lib/lead-lifecycle";
// Types live in src/lib/commercial-guard.d.ts; Vite resolves the .mjs.
// @ts-expect-error -- allowJs not enabled for this workspace
import { parsePublicLead, takeLeadSlot } from "../../scripts/commercial-guard.mjs";
// @ts-expect-error -- JS alert
import { notifyTeamLead } from "../../scripts/lead-alert.mjs";
// @ts-expect-error -- JS validate
import { validateEnv } from "../../scripts/env-validate.mjs";

export type OpsRequest = {
  id: string;
  kind: string;
  firstName: string;
  phone: string;
  email: string;
  zip: string;
  callbackWindow: string;
  doctors: string;
  medications: string;
  budget: string;
  notes: string;
  createdAt: string;
  disposition: string;
  stage: LeadStage;
  disenrollReason: string;
  source: string;
  consentAt: string;
};

export type LeadEvent = {
  id: string;
  leadId: string;
  at: string;
  stage: LeadStage;
  reason: string;
  note: string;
  actor: string;
};

type OpsRow = {
  id: string;
  kind: string;
  first_name: string | null;
  phone: string | null;
  email: string | null;
  zip: string | null;
  callback_window: string | null;
  doctors: string | null;
  medications: string | null;
  budget: string | null;
  notes: string | null;
  created_at: string;
  disposition: string | null;
  source: string | null;
  consent_at: string | null;
  stage: string | null;
  disenroll_reason: string | null;
};

type EventRow = {
  id: string;
  lead_id: string;
  at: string;
  stage: string;
  reason: string | null;
  note: string | null;
  actor: string | null;
};

function mintId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let out = "REQ-";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

function mapRow(row: OpsRow): OpsRequest {
  const stage = normalizeStage(row.stage || row.disposition);
  return {
    id: row.id,
    kind: row.kind,
    firstName: row.first_name ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    zip: row.zip ?? "",
    callbackWindow: row.callback_window ?? "",
    doctors: row.doctors ?? "",
    medications: row.medications ?? "",
    budget: row.budget ?? "",
    notes: row.notes ?? "",
    createdAt: row.created_at,
    disposition: stage,
    stage,
    disenrollReason: row.disenroll_reason ?? "",
    source: row.source ?? (row.kind === "needs" ? "Needs analysis" : "Callback form"),
    consentAt: row.consent_at ?? row.created_at,
  };
}

function mapEvent(row: EventRow): LeadEvent {
  return {
    id: row.id,
    leadId: row.lead_id,
    at: row.at,
    stage: normalizeStage(row.stage),
    reason: row.reason ?? "",
    note: row.note ?? "",
    actor: row.actor ?? "staff",
  };
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

const SELECT_LEAD = `id, kind, first_name, phone, email, zip, callback_window,
             doctors, medications, budget, notes, created_at::text as created_at,
             disposition, source, consent_at::text as consent_at,
             stage, disenroll_reason`;

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
        doctors, medications, budget, notes, disposition, source, consent_at, stage
      ) values (
        ${id}, ${row.kind}, ${row.firstName}, ${row.phone}, ${row.email},
        ${row.zip}, ${row.callbackWindow}, ${row.doctors}, ${row.medications},
        ${row.budget}, ${row.notes}, ${"new"}, ${source}, now(), ${"new"}
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
    return { id };
  });

export const listOpsRequests = createServerFn({ method: "GET" })
  .middleware([staffMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const rows = await sql<OpsRow>`
      select id, kind, first_name, phone, email, zip, callback_window,
             doctors, medications, budget, notes, created_at::text as created_at,
             disposition, source, consent_at::text as consent_at,
             stage, disenroll_reason
      from ops_requests
      order by created_at desc
      limit 120
    `;
    return rows.map(mapRow);
  });

export const listLeadEvents = createServerFn({ method: "POST" })
  .middleware([staffMiddleware])
  .validator((input: { id: string }) => ({ id: input.id.trim().slice(0, 24) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<EventRow>`
      select id::text as id, lead_id, at::text as at, stage, reason, note, actor
      from lead_events
      where lead_id = ${data.id}
      order by at asc
    `;
    return rows.map(mapEvent);
  });

export const advanceLeadStage = createServerFn({ method: "POST" })
  .middleware([staffMiddleware])
  .validator((input: { id: string; stage: string; reason?: string; note?: string }) => ({
    id: input.id.trim().slice(0, 24),
    stage: normalizeStage(input.stage),
    reason: (input.reason ?? "").trim().slice(0, 40),
    note: (input.note ?? "").trim().slice(0, 500),
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const current = await sql<OpsRow>`
      select id, kind, first_name, phone, email, zip, callback_window,
             doctors, medications, budget, notes, created_at::text as created_at,
             disposition, source, consent_at::text as consent_at,
             stage, disenroll_reason
      from ops_requests
      where id = ${data.id}
      limit 1
    `;
    const row = current[0];
    if (!row) throw new Error("Lead not found.");
    const from = normalizeStage(row.stage || row.disposition);
    const allowed = nextStages(from);
    if (!allowed.includes(data.stage)) {
      throw new Error(`Cannot move from ${from} to ${data.stage}.`);
    }
    if (data.stage === "disenrolled" && !data.reason) {
      throw new Error("Pick a disenrollment reason.");
    }
    await sql`
      update ops_requests
      set stage = ${data.stage},
          disposition = ${data.stage},
          disenroll_reason = ${data.stage === "disenrolled" ? data.reason : row.disenroll_reason}
      where id = ${data.id}
    `;
    const actor = context.email || context.userId || "staff";
    await sql`
      insert into lead_events (lead_id, stage, reason, note, actor)
      values (${data.id}, ${data.stage}, ${data.reason}, ${data.note}, ${String(actor)})
    `;
    return { id: data.id, stage: data.stage };
  });

export const updateOpsDisposition = createServerFn({ method: "POST" })
  .middleware([staffMiddleware])
  .validator((input: { id: string; disposition: string }) => ({
    id: input.id.trim().slice(0, 24),
    disposition: normalizeStage(input.disposition),
  }))
  .handler(async ({ data }) => {
    await advanceLeadStage({ data: { id: data.id, stage: data.disposition } });
    return { id: data.id, disposition: data.disposition };
  });

export const getAlertHealth = createServerFn({ method: "GET" })
  .middleware([staffMiddleware])
  .handler(async () => {
    const report = validateEnv(process.env);
    return {
      ok: report.ok,
      resend: report.channels.resend,
      webhook: report.channels.webhook,
    };
  });
