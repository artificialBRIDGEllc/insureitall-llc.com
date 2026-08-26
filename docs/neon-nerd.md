# Neon nerd — artificialBRIDGE

How this app uses Postgres (Neon in prod, PGLite in preview). Read this before touching `DATABASE_URL`.

Not tax advice. Not a HIPAA certificate.

## Connection

| Env | Backend | When |
|---|---|---|
| `DATABASE_URL` set (non-empty) | **Neon** | Vercel / real deploy |
| unset / whitespace | **PGLite** | Grok preview, local |

Migrator: `scripts/migrate.mjs` on `npm run build`. Same files in `/migrations` apply to both backends. Applied names live in `_migrations`.

Do **not** put SSN, MBI, EIN, bank balances, or a founder’s personal net worth in Neon.

## Table catalog

| Table | Migration | Holds |
|---|---|---|
| `_migrations` | migrator | filenames already applied |
| `portal_profiles` | 0002 | fileBRIDGE zip / doctors / meds / notes |
| `portal_shares` | 0003 | revocable share codes |
| `ops_requests` | 0004–0005, 0007 | IIA inbound leads + lifecycle stage |
| `lead_events` | 0007 | stage timeline |
| `ai_feedback_events` | 0006 | deidentified product telemetry only |
| `portal_integrations` | 0007–0008 | agency link + field scopes |
| `portal_consent_events` | 0008 | grant / revoke / delete (kept ~3 years) |
| **`wy_llc_tax_rule`** | **0009** | statute, floor, rate |
| **`wy_llc_license_tax`** | **0009** | published fee schedule |

Auth tables come from Better Auth (0001). Staff console reads `ops_requests`. fileBRIDGE never writes IIA leads.

---

## 0009 — Wyoming LLC license tax

**Entity:** artificialBRIDGE LLC, Wyoming single-member  
**Statute:** W.S. 17-29-209  
**SOS:** [wyobiz.wyo.gov/Business/AnnualReport.aspx](https://wyobiz.wyo.gov/Business/AnnualReport.aspx)  
**As of:** 25 August 2026  
**TS mirror:** `src/lib/wy-llc-tax.ts`

### Rule

```
tax_usd = greatest(floor_usd, round(wyoming_situs_assets * rate, 2))
floor_usd = 60
rate      = 0.0002
break     = 60 / 0.0002 = 300,000   -- at or below this, you pay $60
efile_max = 500                     -- above this, mail only
due       = first day of anniversary month of formation
early     = 120 days
```

**Wyoming-situs assets** = capital, property, and assets **located and employed in Wyoming**. A Texas operator with no WY real estate, no WY cash pile, and no WY office reports **$0** and pays **$60**. A registered-agent street in Cheyenne does not move a laptop or a Neon invoice into Wyoming.

### `wy_llc_tax_rule`

| Column | Type | Meaning |
|---|---|---|
| `statute` | text PK | `W.S. 17-29-209` |
| `floor_usd` | numeric(10,2) | $60 |
| `rate` | numeric(12,8) | 0.0002 |
| `asset_break_usd` | numeric(14,2) | $300,000 |
| `efile_max_usd` | numeric(10,2) | $500 |
| `due_rule` | text | anniversary month, day 1 |
| `early_days` | int | 120 |
| `card_pct` | numeric | 0.024 online |
| `card_min_usd` | numeric | $1 |
| `source_url` | text | SOS annual report URL |
| `as_of` | date | when we last checked SOS |
| `notes` | text | missed-filing + reinstatement |

```sql
select statute, floor_usd, rate, asset_break_usd, due_rule
from wy_llc_tax_rule;
```

### `wy_llc_license_tax` — Neon SQL Editor

Paste this in Neon. This **is** the table.

```sql
SELECT
  '$' || to_char(wy_assets_usd, 'FM999,999,999') AS "WY assets",
  '$' || to_char(tax_usd,       'FM9,999.00')    AS "Tax",
  CASE WHEN efile_ok THEN 'yes' ELSE 'mail' END  AS "E-file",
  band                                           AS "Band"
FROM wy_llc_license_tax
ORDER BY wy_assets_usd;
```

Same thing as a view:

```sql
SELECT "WY assets", "Tax", "E-file", "Band"
FROM wy_llc_license_tax_print
ORDER BY sort_usd;
```

Expected result:

```
 WY assets  | Tax       | E-file | Band
------------+-----------+--------+------------
 $0         | $60.00    | yes    | floor
 $100,000   | $60.00    | yes    | floor
 $300,000   | $60.00    | yes    | break even
 $500,000   | $100.00   | yes    | rate
 $1,000,000 | $200.00   | yes    | rate
 $1,210,000 | $242.00   | yes    | rate
 $2,500,000 | $500.00   | yes    | efile max
 $5,000,000 | $1,000.00 | mail   | mail only
```

Compute a number that is not in the seed (Neon parameters: use a literal or a prepared value):

```sql
WITH r AS (
  SELECT floor_usd, rate
  FROM wy_llc_tax_rule
  WHERE statute = 'W.S. 17-29-209'
)
SELECT greatest(r.floor_usd, round(0::numeric * r.rate, 2)) AS tax_usd
FROM r;
-- replace 0 with wyoming-situs assets
```


TS:

```ts
import { wyLicenseTax, WY_TAX_TABLE } from "@/lib/wy-llc-tax";
wyLicenseTax(0);        // 60
wyLicenseTax(500_000);  // 100
```

### What never goes in these tables

- EIN, SSN, MBI  
- Bank or brokerage balances  
- Personal house, truck, or Texas operating cash  
- Filing ID / SOS login  
- Registered-agent invoice  

Those stay with the member and the SOS portal. This is a **reference schedule**, not the LLC’s books.

### Missed filing (from SOS FAQ / statute)

No classic late fee. Pending dissolution/revocation, about 60 days to cure. Revival within two years: reinstatement fee + **$250** penalty.

---

## Other Neon rules (short)

- **fileBRIDGE PHI** (optional doctor/med names) lives in `portal_profiles`. Controller: artificialBRIDGE LLC. IIA sees it only via `portal_integrations` scopes.  
- **IIA leads** live in `ops_requests`. Alerts never email doctors/meds/notes.  
- **Training loop** is `ai_feedback_events` only after identifier scan. No emails, phones, zips, doctors, meds.  
- Migrations are append-only. Never rewrite an applied file; add `0010_…sql`.
