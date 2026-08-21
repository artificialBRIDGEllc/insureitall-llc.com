-- Share codes so a person can hand their file to a new agent, agency, or carrier.
create table if not exists portal_shares (
  id text primary key,
  owner_user_id text not null,
  audience text not null,
  label text not null default '',
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  last_opened_at timestamptz,
  opened_by_user_id text
);

create index if not exists portal_shares_owner_idx on portal_shares (owner_user_id);
create index if not exists portal_shares_audience_idx on portal_shares (audience);
