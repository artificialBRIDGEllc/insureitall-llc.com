-- Fixes: "new row for relation ops_requests violates check constraint
-- ops_requests_disposition_chk" on every public contact-form submission.
--
-- Production's ops_requests carries staff-triage columns (status,
-- disposition, assignee_email, claimed_at, contacted_at, ...) added directly
-- against Neon before the staff console was extracted to BRIDGEt Console --
-- the migration files that created them were removed from this repo in that
-- extraction, but the already-applied schema stayed live. There,
-- `disposition` is nullable with no default and a check constraint that only
-- allows a staff-set closing outcome (scheduled/enrolled/not_interested/
-- unreachable/duplicate/bad_contact) or null -- never 'new'.
--
-- Migration 0005 (which predates this discovery) set disposition
-- `not null default 'new'`, but `add column if not exists` made that a no-op
-- against the already-existing prod column, so prod kept its stricter
-- definition while PGLite preview -- built from this repo's migrations alone,
-- with no such constraint -- got the looser one. `submitOpsRequest` and the
-- GHL lead-intake route both insert the literal `'new'`, which prod's check
-- constraint rejects. disposition is staff-set only, on close; public lead
-- inserts must leave it null. This reconciles preview to match prod and
-- makes the constraint explicit everywhere.

alter table ops_requests alter column disposition drop not null;
alter table ops_requests alter column disposition drop default;

update ops_requests set disposition = null where disposition = 'new';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'ops_requests_disposition_chk'
  ) then
    alter table ops_requests add constraint ops_requests_disposition_chk
      check (disposition is null or disposition = any (array[
        'scheduled', 'enrolled', 'not_interested', 'unreachable', 'duplicate', 'bad_contact'
      ]));
  end if;
end $$;
