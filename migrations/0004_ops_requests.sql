-- Inbound consumer requests for INSUREitALL team ops (not a public directory).
create table if not exists ops_requests (
  id text primary key,
  kind text not null,
  first_name text,
  phone text,
  email text,
  zip text,
  callback_window text,
  doctors text,
  medications text,
  budget text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists ops_requests_created_idx on ops_requests (created_at desc);
