-- Deidentified product telemetry for BRIDGEt training.
-- No names, phones, emails, zips, doctors, medications, notes, SSN, or MBI.

create table if not exists ai_feedback_events (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  event text not null,
  path text not null default '',
  payload jsonb not null default '{}'::jsonb
);

create index if not exists ai_feedback_events_occurred_idx
  on ai_feedback_events (occurred_at desc);

create index if not exists ai_feedback_events_event_idx
  on ai_feedback_events (event, occurred_at desc);
