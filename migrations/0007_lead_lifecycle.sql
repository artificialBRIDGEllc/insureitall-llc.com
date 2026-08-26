-- Lead lifecycle through enrollment / disenrollment. Not MARx.

alter table ops_requests add column if not exists stage text;
alter table ops_requests add column if not exists disenroll_reason text;
alter table ops_requests add column if not exists portal_user_id text;

update ops_requests
set stage = case disposition
  when 'scheduled' then 'appointed'
  when 'closed' then 'closed_lost'
  when 'new' then 'new'
  when 'contacted' then 'contacted'
  else coalesce(nullif(stage, ''), 'new')
end
where stage is null or stage = '';

create table if not exists lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id text not null,
  at timestamptz not null default now(),
  stage text not null,
  reason text,
  note text not null default '',
  actor text not null default 'staff'
);

create index if not exists lead_events_lead_idx on lead_events (lead_id, at);

create table if not exists portal_integrations (
  user_id text not null,
  partner_id text not null default 'insureitall',
  connected_at timestamptz not null default now(),
  revoked_at timestamptz,
  share_id text,
  primary key (user_id, partner_id)
);
