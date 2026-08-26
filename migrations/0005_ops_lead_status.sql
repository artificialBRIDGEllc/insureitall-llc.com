-- Staff console: disposition, source, and consent timestamp on inbound requests.
alter table ops_requests add column if not exists disposition text not null default 'new';
alter table ops_requests add column if not exists source text;
alter table ops_requests add column if not exists consent_at timestamptz;

update ops_requests
set source = case
  when kind = 'needs' then 'Needs analysis'
  else 'Callback form'
end
where source is null;
