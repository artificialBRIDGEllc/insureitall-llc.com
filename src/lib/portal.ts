import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { staffMiddleware } from "@/lib/staff-middleware";
import { getSql } from "@/lib/db";

export type PortalRole = "client" | "internal";

export type PortalProfile = {
  userId: string;
  role: PortalRole;
  zip: string;
  doctors: string;
  medications: string;
  budget: string;
  notes: string;
  updatedAt: string;
};

type ProfileRow = {
  user_id: string;
  role: string;
  zip: string | null;
  doctors: string | null;
  medications: string | null;
  budget: string | null;
  notes: string | null;
  updated_at: string;
};

function mapRow(row: ProfileRow): PortalProfile {
  return {
    userId: row.user_id,
    role: row.role === "internal" ? "internal" : "client",
    zip: row.zip ?? "",
    doctors: row.doctors ?? "",
    medications: row.medications ?? "",
    budget: row.budget ?? "",
    notes: row.notes ?? "",
    updatedAt: row.updated_at,
  };
}

export const getPortalProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const existing = await sql<ProfileRow>`
      select user_id, role, zip, doctors, medications, budget, notes,
             updated_at::text as updated_at
      from portal_profiles
      where user_id = ${context.userId}
      limit 1
    `;
    if (existing[0]) return mapRow(existing[0]);
    await sql`
      insert into portal_profiles (user_id, role)
      values (${context.userId}, 'client')
      on conflict (user_id) do nothing
    `;
    const created = await sql<ProfileRow>`
      select user_id, role, zip, doctors, medications, budget, notes,
             updated_at::text as updated_at
      from portal_profiles
      where user_id = ${context.userId}
      limit 1
    `;
    return created[0] ? mapRow(created[0]) : null;
  });

export const savePortalProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Partial<Omit<PortalProfile, "userId" | "updatedAt">>) => ({
    role: input.role === "internal" ? "internal" : "client",
    zip: (input.zip ?? "").trim().slice(0, 16),
    doctors: (input.doctors ?? "").trim().slice(0, 2000),
    medications: (input.medications ?? "").trim().slice(0, 2000),
    budget: (input.budget ?? "").trim().slice(0, 64),
    notes: (input.notes ?? "").trim().slice(0, 2000),
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<ProfileRow>`
      insert into portal_profiles
        (user_id, role, zip, doctors, medications, budget, notes, updated_at)
      values
        (${context.userId}, ${data.role}, ${data.zip}, ${data.doctors},
         ${data.medications}, ${data.budget}, ${data.notes}, now())
      on conflict (user_id) do update set
        role = excluded.role,
        zip = excluded.zip,
        doctors = excluded.doctors,
        medications = excluded.medications,
        budget = excluded.budget,
        notes = excluded.notes,
        updated_at = now()
      returning user_id, role, zip, doctors, medications, budget, notes,
                updated_at::text as updated_at
    `;
    return rows[0] ? mapRow(rows[0]) : null;
  });

export type ShareAudience = "agent" | "agency" | "carrier";

export type PortalShare = {
  id: string;
  audience: ShareAudience;
  label: string;
  createdAt: string;
  revokedAt: string | null;
  lastOpenedAt: string | null;
};

export type OpenedFile = {
  audience: ShareAudience;
  label: string;
  zip: string;
  doctors: string;
  medications: string;
  budget: string;
  notes: string;
  updatedAt: string;
};

type ShareRow = {
  id: string;
  audience: string;
  label: string;
  created_at: string;
  revoked_at: string | null;
  last_opened_at: string | null;
};

function asAudience(value: string): ShareAudience {
  if (value === "agency" || value === "carrier") return value;
  return "agent";
}

function mintCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let out = "IIA-";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

function mapShare(row: ShareRow): PortalShare {
  return {
    id: row.id,
    audience: asAudience(row.audience),
    label: row.label,
    createdAt: row.created_at,
    revokedAt: row.revoked_at,
    lastOpenedAt: row.last_opened_at,
  };
}

export const listPortalShares = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<ShareRow>`
      select id, audience, label,
             created_at::text as created_at,
             revoked_at::text as revoked_at,
             last_opened_at::text as last_opened_at
      from portal_shares
      where owner_user_id = ${context.userId}
      order by created_at desc
    `;
    return rows.map(mapShare);
  });

export const createPortalShare = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { audience: ShareAudience; label?: string }) => ({
    audience: asAudience(input.audience),
    label: (input.label ?? "").trim().slice(0, 80),
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    for (let i = 0; i < 6; i += 1) {
      const id = mintCode();
      try {
        const rows = await sql<ShareRow>`
          insert into portal_shares (id, owner_user_id, audience, label)
          values (${id}, ${context.userId}, ${data.audience}, ${data.label})
          returning id, audience, label,
                    created_at::text as created_at,
                    revoked_at::text as revoked_at,
                    last_opened_at::text as last_opened_at
        `;
        if (rows[0]) return mapShare(rows[0]);
      } catch {
        /* unique collision — retry */
      }
    }
    throw new Error("Could not create a share code.");
  });

export const revokePortalShare = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => ({
    id: input.id.trim().toUpperCase().slice(0, 16),
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update portal_shares
      set revoked_at = now()
      where id = ${data.id}
        and owner_user_id = ${context.userId}
        and revoked_at is null
    `;
    return { ok: true };
  });

export const openPortalShare = createServerFn({ method: "POST" })
  .middleware([staffMiddleware])
  .validator((input: { id: string }) => ({
    id: input.id.trim().toUpperCase().slice(0, 16),
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const shares = await sql<{
      id: string;
      owner_user_id: string;
      audience: string;
      label: string;
      revoked_at: string | null;
    }>`
      select id, owner_user_id, audience, label, revoked_at::text as revoked_at
      from portal_shares
      where id = ${data.id}
      limit 1
    `;
    const share = shares[0];
    if (!share || share.revoked_at) return null;
    const profiles = await sql<ProfileRow>`
      select user_id, role, zip, doctors, medications, budget, notes,
             updated_at::text as updated_at
      from portal_profiles
      where user_id = ${share.owner_user_id}
      limit 1
    `;
    const profile = profiles[0];
    if (!profile) return null;
    await sql`
      update portal_shares
      set last_opened_at = now(), opened_by_user_id = ${context.userId}
      where id = ${share.id}
    `;
    return {
      audience: asAudience(share.audience),
      label: share.label,
      zip: profile.zip ?? "",
      doctors: profile.doctors ?? "",
      medications: profile.medications ?? "",
      budget: profile.budget ?? "",
      notes: profile.notes ?? "",
      updatedAt: profile.updated_at,
    } satisfies OpenedFile;
  });
