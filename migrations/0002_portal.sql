-- Coverage file that stays with the person, not the agent/agency/carrier.
create table if not exists portal_profiles (
  user_id text primary key,
  role text not null default 'client',
  zip text,
  doctors text,
  medications text,
  budget text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portal_profiles_role_idx on portal_profiles (role);
