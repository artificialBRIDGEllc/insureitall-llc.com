import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { staffMiddleware } from "@/lib/staff-middleware";
import { getSql } from "@/lib/db";
// @ts-expect-error -- JS guard
import { containsForbiddenId, FORBIDDEN_ID_ERROR } from "../../scripts/commercial-guard.mjs";

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
    const blob = `${data.doctors} ${data.medications} ${data.notes}`;
    if (containsForbiddenId(blob)) {
      throw new Error(FORBIDDEN_ID_ERROR);
    }
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

export type ConsentScope = {
  zip: boolean;
  doctors: boolean;
  medications: boolean;
  budget: boolean;
  notes: boolean;
};

export const EMPTY_SCOPE: ConsentScope = {
  zip: true,
  doctors: false,
  medications: false,
  budget: true,
  notes: false,
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
  operator: "artificialbridge";
  scopes: ConsentScope;
  withheld: string[];
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
  let out = "AB-";
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

    let scopes: ConsentScope = { zip: true, doctors: true, medications: true, budget: true, notes: true };
    if (share.audience === "agency") {
      const links = await sql<{
        revoked_at: string | null;
        scope_zip: boolean | null;
        scope_doctors: boolean | null;
        scope_medications: boolean | null;
        scope_budget: boolean | null;
        scope_notes: boolean | null;
      }>`
        select revoked_at::text as revoked_at, scope_zip, scope_doctors,
               scope_medications, scope_budget, scope_notes
        from portal_integrations
        where user_id = ${share.owner_user_id}
          and partner_id = ${AGENCY_PARTNER}
        limit 1
      `;
      const link = links[0];
      if (!link || link.revoked_at) return null;
      scopes = {
        zip: Boolean(link.scope_zip),
        doctors: Boolean(link.scope_doctors),
        medications: Boolean(link.scope_medications),
        budget: Boolean(link.scope_budget),
        notes: Boolean(link.scope_notes),
      };
    }

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
    const withheld = (Object.keys(scopes) as (keyof ConsentScope)[]).filter((k) => !scopes[k]);
    return {
      audience: asAudience(share.audience),
      label: share.label,
      zip: scopes.zip ? (profile.zip ?? "") : "",
      doctors: scopes.doctors ? (profile.doctors ?? "") : "",
      medications: scopes.medications ? (profile.medications ?? "") : "",
      budget: scopes.budget ? (profile.budget ?? "") : "",
      notes: scopes.notes ? (profile.notes ?? "") : "",
      updatedAt: profile.updated_at,
      operator: "artificialbridge" as const,
      scopes,
      withheld,
    } satisfies OpenedFile;
  });


export const AGENCY_PARTNER = "insureitall";
export const PORTAL_OPERATOR = "artificialBRIDGE LLC";

export type AgencyLink = {
  partnerId: string;
  partnerName: string;
  operator: string;
  connected: boolean;
  connectedAt: string | null;
  revokedAt: string | null;
  shareId: string | null;
  scopes: ConsentScope;
  consentAt: string | null;
};

export const getAgencyLink = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      partner_id: string;
      connected_at: string;
      revoked_at: string | null;
      share_id: string | null;
      scope_zip: boolean | null;
      scope_doctors: boolean | null;
      scope_medications: boolean | null;
      scope_budget: boolean | null;
      scope_notes: boolean | null;
      consent_at: string | null;
    }>`
      select partner_id, connected_at::text as connected_at,
             revoked_at::text as revoked_at, share_id,
             scope_zip, scope_doctors, scope_medications, scope_budget, scope_notes,
             consent_at::text as consent_at
      from portal_integrations
      where user_id = ${context.userId} and partner_id = ${AGENCY_PARTNER}
      limit 1
    `;
    const row = rows[0];
    return {
      partnerId: AGENCY_PARTNER,
      partnerName: "INSUREitALL",
      operator: PORTAL_OPERATOR,
      connected: Boolean(row && !row.revoked_at),
      connectedAt: row?.connected_at ?? null,
      revokedAt: row?.revoked_at ?? null,
      shareId: row?.share_id ?? null,
      scopes: {
        zip: row?.scope_zip ?? true,
        doctors: row?.scope_doctors ?? false,
        medications: row?.scope_medications ?? false,
        budget: row?.scope_budget ?? true,
        notes: row?.scope_notes ?? false,
      },
      consentAt: row?.consent_at ?? null,
    } satisfies AgencyLink;
  });

export const connectAgency = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { consent: boolean; scopes?: Partial<ConsentScope> }) => ({
    consent: input.consent === true,
    scopes: {
      zip: input.scopes?.zip !== false,
      doctors: input.scopes?.doctors === true,
      medications: input.scopes?.medications === true,
      budget: input.scopes?.budget !== false,
      notes: input.scopes?.notes === true,
    } satisfies ConsentScope,
  }))
  .handler(async ({ context, data }) => {
    if (!data.consent) throw new Error("Express consent is required.");
    const sql = await getSql();
    let shareId = "";
    for (let i = 0; i < 6; i += 1) {
      const id = mintCode();
      try {
        await sql`
          insert into portal_shares (id, owner_user_id, audience, label)
          values (${id}, ${context.userId}, ${"agency"}, ${"INSUREitALL"})
        `;
        shareId = id;
        break;
      } catch {
        /* collision */
      }
    }
    if (!shareId) throw new Error("Could not connect.");
    const s = data.scopes;
    await sql`
      insert into portal_integrations (
        user_id, partner_id, connected_at, revoked_at, share_id,
        scope_zip, scope_doctors, scope_medications, scope_budget, scope_notes, consent_at
      ) values (
        ${context.userId}, ${AGENCY_PARTNER}, now(), null, ${shareId},
        ${s.zip}, ${s.doctors}, ${s.medications}, ${s.budget}, ${s.notes}, now()
      )
      on conflict (user_id, partner_id) do update set
        connected_at = now(),
        revoked_at = null,
        share_id = excluded.share_id,
        scope_zip = excluded.scope_zip,
        scope_doctors = excluded.scope_doctors,
        scope_medications = excluded.scope_medications,
        scope_budget = excluded.scope_budget,
        scope_notes = excluded.scope_notes,
        consent_at = now()
    `;
    await sql`
      insert into portal_consent_events (user_id, partner_id, action, scopes)
      values (
        ${context.userId}, ${AGENCY_PARTNER}, ${"grant"},
        ${JSON.stringify(s)}
      )
    `;
    return {
      partnerId: AGENCY_PARTNER,
      partnerName: "INSUREitALL",
      operator: PORTAL_OPERATOR,
      connected: true,
      connectedAt: new Date().toISOString(),
      revokedAt: null,
      shareId,
      scopes: s,
      consentAt: new Date().toISOString(),
    } satisfies AgencyLink;
  });

export const disconnectAgency = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`
      update portal_shares
      set revoked_at = now()
      where owner_user_id = ${context.userId}
        and audience = ${"agency"}
        and revoked_at is null
    `;
    await sql`
      insert into portal_integrations (user_id, partner_id, connected_at, revoked_at)
      values (${context.userId}, ${AGENCY_PARTNER}, now(), now())
      on conflict (user_id, partner_id) do update set
        revoked_at = now()
    `;
    await sql`
      insert into portal_consent_events (user_id, partner_id, action, scopes)
      values (${context.userId}, ${AGENCY_PARTNER}, ${"revoke"}, ${""})
    `;
    return {
      partnerId: AGENCY_PARTNER,
      partnerName: "INSUREitALL",
      operator: PORTAL_OPERATOR,
      connected: false,
      connectedAt: null,
      revokedAt: new Date().toISOString(),
      shareId: null,
      scopes: EMPTY_SCOPE,
      consentAt: null,
    } satisfies AgencyLink;
  });

export const exportPortalFile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const profiles = await sql<ProfileRow>`
      select user_id, role, zip, doctors, medications, budget, notes,
             updated_at::text as updated_at
      from portal_profiles
      where user_id = ${context.userId}
      limit 1
    `;
    const shares = await sql<ShareRow>`
      select id, audience, label,
             created_at::text as created_at,
             revoked_at::text as revoked_at,
             last_opened_at::text as last_opened_at
      from portal_shares
      where owner_user_id = ${context.userId}
      order by created_at desc
    `;
    const consents = await sql<{ action: string; scopes: string; at: string }>`
      select action, scopes, at::text as at
      from portal_consent_events
      where user_id = ${context.userId}
      order by at desc
      limit 50
    `;
    return {
      operator: PORTAL_OPERATOR,
      product: "fileBRIDGE",
      exportedAt: new Date().toISOString(),
      profile: profiles[0] ? mapRow(profiles[0]) : null,
      shares: shares.map(mapShare),
      consents,
    };
  });

export const deletePortalAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { confirm?: string }) => ({
    confirm: (input.confirm ?? "").trim().toUpperCase(),
  }))
  .handler(async ({ context, data }) => {
    if (data.confirm !== "DELETE") throw new Error("Type DELETE to confirm.");
    const sql = await getSql();
    await sql`
      update portal_shares
      set revoked_at = now()
      where owner_user_id = ${context.userId} and revoked_at is null
    `;
    await sql`
      update portal_integrations
      set revoked_at = now()
      where user_id = ${context.userId} and revoked_at is null
    `;
    await sql`
      update portal_profiles
      set zip = '', doctors = '', medications = '', budget = '', notes = '', updated_at = now()
      where user_id = ${context.userId}
    `;
    await sql`
      insert into portal_consent_events (user_id, partner_id, action, scopes)
      values (${context.userId}, ${AGENCY_PARTNER}, ${"delete"}, ${""})
    `;
    return { ok: true };
  });


