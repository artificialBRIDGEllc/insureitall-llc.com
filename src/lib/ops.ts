import { createServerFn } from "@tanstack/react-start";
import { staffMiddleware } from "@/lib/staff-middleware";
import { getSql } from "@/lib/db";

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
  };
}

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
  }) => ({
    kind: input.kind === "needs" ? "needs" : "callback",
    firstName: (input.firstName ?? "").trim().slice(0, 80),
    phone: (input.phone ?? "").trim().slice(0, 32),
    email: (input.email ?? "").trim().slice(0, 120),
    zip: (input.zip ?? "").trim().slice(0, 16),
    callbackWindow: (input.callbackWindow ?? "").trim().slice(0, 40),
    doctors: (input.doctors ?? "").trim().slice(0, 2000),
    medications: (input.medications ?? "").trim().slice(0, 2000),
    budget: (input.budget ?? "").trim().slice(0, 64),
    notes: (input.notes ?? "").trim().slice(0, 2000),
  }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = mintId();
    await sql`
      insert into ops_requests (
        id, kind, first_name, phone, email, zip, callback_window,
        doctors, medications, budget, notes
      ) values (
        ${id}, ${data.kind}, ${data.firstName}, ${data.phone}, ${data.email},
        ${data.zip}, ${data.callbackWindow}, ${data.doctors}, ${data.medications},
        ${data.budget}, ${data.notes}
      )
    `;
    return { id };
  });

export const listOpsRequests = createServerFn({ method: "GET" })
  .middleware([staffMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const rows = await sql<OpsRow>`
      select id, kind, first_name, phone, email, zip, callback_window,
             doctors, medications, budget, notes, created_at::text as created_at
      from ops_requests
      order by created_at desc
      limit 50
    `;
    return rows.map(mapRow);
  });
