-- Portal is an Artificial Bridge app. Agency access is scoped by beneficiary consent.

alter table portal_integrations add column if not exists scope_zip boolean not null default true;
alter table portal_integrations add column if not exists scope_doctors boolean not null default false;
alter table portal_integrations add column if not exists scope_medications boolean not null default false;
alter table portal_integrations add column if not exists scope_budget boolean not null default true;
alter table portal_integrations add column if not exists scope_notes boolean not null default false;
alter table portal_integrations add column if not exists consent_at timestamptz;

create table if not exists portal_consent_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  partner_id text not null,
  action text not null,
  scopes text not null default '',
  at timestamptz not null default now()
);

create index if not exists portal_consent_events_user_idx
  on portal_consent_events (user_id, at desc);
