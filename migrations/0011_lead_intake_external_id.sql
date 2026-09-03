-- Idempotency key for server-to-server lead intake (GoHighLevel webhook).
-- GHL retries webhook delivery on any non-2xx response, so a repeat delivery
-- must not create a second ops_requests row. Native site forms leave this null.

alter table ops_requests add column if not exists external_id text;

-- Partial unique index: many nulls allowed (native forms), one row per
-- external submission id. A plain unique constraint would work in Postgres
-- since nulls are distinct, but the partial index makes the intent explicit
-- and keeps the index small.
create unique index if not exists ops_requests_external_id_key
  on ops_requests (external_id)
  where external_id is not null;