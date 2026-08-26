-- Neon nerd: Wyoming LLC annual report / license tax (W.S. 17-29-209)
-- artificialBRIDGE LLC — Wyoming single-member. Reference data only.
-- NOT tax advice. Do not store EIN, SSN, bank balances, or personal assets here.
-- Fee = greater of floor_usd or (wyoming_situs_assets * rate).

create table if not exists wy_llc_tax_rule (
  statute         text primary key,
  floor_usd       numeric(10,2) not null,
  rate            numeric(12,8) not null,
  asset_break_usd numeric(14,2) not null,
  efile_max_usd   numeric(10,2) not null,
  due_rule        text not null,
  early_days      integer not null,
  card_pct        numeric(6,4) not null,
  card_min_usd    numeric(6,2) not null,
  source_url      text not null,
  as_of           date not null,
  notes           text not null default ''
);

insert into wy_llc_tax_rule (
  statute, floor_usd, rate, asset_break_usd, efile_max_usd,
  due_rule, early_days, card_pct, card_min_usd, source_url, as_of, notes
) values (
  'W.S. 17-29-209',
  60.00,
  0.0002,
  300000.00,
  500.00,
  'first day of anniversary month of formation',
  120,
  0.0240,
  1.00,
  'https://wyobiz.wyo.gov/Business/AnnualReport.aspx',
  '2026-08-25',
  'Assets means capital, property, and assets located and employed in Wyoming — not Texas operating assets. Registered agent address does not relocate assets. Mail has no card fee. Missed filing: pending dissolution, ~60 days, then 2-year reinstatement window with $250 penalty.'
)
on conflict (statute) do update set
  floor_usd = excluded.floor_usd,
  rate = excluded.rate,
  asset_break_usd = excluded.asset_break_usd,
  efile_max_usd = excluded.efile_max_usd,
  due_rule = excluded.due_rule,
  source_url = excluded.source_url,
  as_of = excluded.as_of,
  notes = excluded.notes;

create table if not exists wy_llc_license_tax (
  wy_assets_usd numeric(14,2) primary key,
  tax_usd       numeric(10,2) not null,
  efile_ok      boolean not null,
  band          text not null
);

insert into wy_llc_license_tax (wy_assets_usd, tax_usd, efile_ok, band) values
  (0,           60.00,  true,  'floor'),
  (100000,      60.00,  true,  'floor'),
  (300000,      60.00,  true,  'break even'),
  (500000,     100.00,  true,  'rate'),
  (1000000,    200.00,  true,  'rate'),
  (1210000,    242.00,  true,  'rate'),
  (2500000,    500.00,  true,  'efile max'),
  (5000000,   1000.00,  false, 'mail only')
on conflict (wy_assets_usd) do update set
  tax_usd = excluded.tax_usd,
  efile_ok = excluded.efile_ok,
  band = excluded.band;
