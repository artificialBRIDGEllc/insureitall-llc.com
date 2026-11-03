-- Onboarding portal schema for new-hire onboarding
-- Lives under /onboarding on insureitall-llc.com
-- Never stores SSN or DOB. Checkr collects those directly.

create table if not exists onboarding_hires (
  id text primary key,
  email text not null unique,
  name text not null,
  worker_type text not null check (worker_type in ('1099_remote', '1099_inoffice', 'w2')),
  position text,
  team_lead_email text,
  start_date date,
  location text,
  status text not null default 'invited' check (status in ('invited', 'active', 'separated', 'completed')),
  active_cycle text default 'initial',
  monday_item_id text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists onboarding_invites (
  id text primary key,
  hire_id text not null references onboarding_hires(id) on delete cascade,
  email_hash text not null,
  expires_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'cancelled', 'expired')),
  created_at timestamptz default now() not null
);

create table if not exists onboarding_steps (
  id text primary key,
  hire_id text not null references onboarding_hires(id) on delete cascade,
  cycle text not null default 'initial',
  step_key text not null,
  status text not null default 'locked' check (status in ('locked', 'current', 'waiting', 'returned', 'done')),
  answers jsonb,
  signature_record jsonb,
  signed_copy_key text,
  return_note text,
  confirmed_by text,
  confirmed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (hire_id, cycle, step_key)
);

create table if not exists onboarding_approvals (
  id text primary key,
  step_id text not null references onboarding_steps(id) on delete cascade,
  action text not null check (action in ('confirm', 'return', 'undo')),
  staff_email text not null,
  note text,
  created_at timestamptz default now() not null
);

create table if not exists onboarding_owner_sections (
  id text primary key,
  hire_id text not null references onboarding_hires(id) on delete cascade,
  step_key text not null,
  content jsonb not null,
  author_email text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists onboarding_documents (
  id text primary key,
  step_key text not null,
  version text not null,
  file_key text not null,
  sha256 text not null,
  uploaded_by text not null,
  created_at timestamptz default now() not null,
  unique (step_key, version)
);

create table if not exists onboarding_checkr (
  hire_id text primary key references onboarding_hires(id) on delete cascade,
  candidate_id text,
  invitation_id text,
  status text,
  webhook_history jsonb default '[]'::jsonb,
  updated_at timestamptz default now() not null
);

create table if not exists onboarding_offboarding (
  hire_id text primary key references onboarding_hires(id) on delete cascade,
  form_answers jsonb,
  pdf_key text,
  created_at timestamptz default now() not null
);

create table if not exists onboarding_audit_log (
  id text primary key,
  actor_email text,
  action text not null,
  target_id text,
  details jsonb,
  created_at timestamptz default now() not null
);

create index if not exists onboarding_steps_hire_cycle_idx on onboarding_steps (hire_id, cycle);
create index if not exists onboarding_approvals_step_idx on onboarding_approvals (step_id);
create index if not exists onboarding_audit_log_created_idx on onboarding_audit_log (created_at);
