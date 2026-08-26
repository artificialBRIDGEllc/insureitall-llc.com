-- Neon SQL Editor print of the Wyoming license-tax schedule.
-- Paste in Neon:  SELECT * FROM wy_llc_license_tax_print ORDER BY sort_usd;

create or replace view wy_llc_license_tax_print as
select
  wy_assets_usd as sort_usd,
  ('$' || to_char(wy_assets_usd, 'FM999,999,999')) as "WY assets",
  ('$' || to_char(tax_usd, 'FM9,999.00')) as "Tax",
  case when efile_ok then 'yes' else 'mail' end as "E-file",
  band as "Band"
from wy_llc_license_tax;

comment on view wy_llc_license_tax_print is
  'Formatted W.S. 17-29-209 schedule for Neon SQL Editor. Not tax advice.';

comment on table wy_llc_license_tax is
  'Wyoming LLC license tax seed rows. Fee = greatest(60, wy_assets * 0.0002).';

comment on table wy_llc_tax_rule is
  'W.S. 17-29-209 rule row. Wyoming-situs assets only. No EIN/SSN.';
