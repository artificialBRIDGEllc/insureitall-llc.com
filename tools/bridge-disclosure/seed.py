"""Fixture seed. Swap the landscape/appointment loaders for real feeds; the
variant table and the resolver do not change."""

import sqlite3
from datetime import datetime, timedelta, date
from pathlib import Path

# ===========================================================================
# CONFIRMED 2026-09-05 against Cornell LII (law.cornell.edu/cfr/text/42/422.2267)
# and the Federal Register (federalregister.gov/documents/2026/04/06/2026-06600).
#
# CMS amended 422.2267(e)(41)/423.2267(e)(41) in the CY2027 MA/Part D final rule
# (CMS-4208-F3 / CMS-4212-F, RIN 0938-AV40, 91 FR 17384-17602 at 17583, doc
# 2026-06600, published 4/6/2026), removing SHIP from the standardized text and
# moving verbal-disclosure timing from "first minute" to "prior to the
# discussion of any benefits." It applies to CY2027 marketing, which begins
# Oct 1, 2026. Current verified text of both post-amendment forms is quoted
# verbatim below in v2027_partial / v2027_all.
# ===========================================================================
SHIP_REMOVAL_EFFECTIVE = "2026-10-01"
SHIP_REMOVAL_CONFIRMED = 1

VARIANTS = [
    # variant_id, sells_all, numeric, text, effective_from, effective_to, citation, confirmed
    ("v2024_partial_ship", 0, 1,
     "We do not offer every plan available in your area. Currently we represent "
     "{orgs} organizations which offer {products} products in your area. Please "
     "contact Medicare.gov, 1-800-MEDICARE, or your local State Health Insurance "
     "Program (SHIP) to get information on all of your options.",
     "2023-09-30", str(date.fromisoformat(SHIP_REMOVAL_EFFECTIVE) - timedelta(days=1)),
     "42 CFR 422.2267(e)(41) as amended 88 FR 22335", 1),

    ("v2027_partial", 0, 1,
     "We do not offer every plan available in your area. Currently we represent "
     "{orgs} organizations which offer {products} products in your area. Please "
     "contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.",
     SHIP_REMOVAL_EFFECTIVE, None,
     "42 CFR 422.2267(e)(41) as amended 91 FR 17583 (Apr 6, 2026)", SHIP_REMOVAL_CONFIRMED),

    ("v2027_all", 1, 1,
     "Currently we represent {orgs} organizations which offer {products} products "
     "in your area. You can always contact Medicare.gov or 1-800-MEDICARE for help "
     "with plan choices.",
     SHIP_REMOVAL_EFFECTIVE, None,
     "42 CFR 422.2267(e)(41) as amended 91 FR 17583 (Apr 6, 2026)", SHIP_REMOVAL_CONFIRMED),

    ("v2024_all_ship", 1, 1,
     "Currently we represent {orgs} organizations which offer {products} products "
     "in your area. You can always contact Medicare.gov, 1-800-MEDICARE, or your "
     "local State Health Insurance Program (SHIP) for help with plan choices.",
     "2023-09-30", str(date.fromisoformat(SHIP_REMOVAL_EFFECTIVE) - timedelta(days=1)),
     "42 CFR 422.2267(e)(41) as amended 88 FR 22335", 1),

    # Fail-closed text. NOTE: this generic no-numbers form traces to the 2023
    # version of the reg and to CMS informal guidance for anonymous landing
    # pages. Its current standing needs the same verification as the boundary
    # above -- confirmed=0 on purpose.
    ("v_generic_nonumbers", 0, 0,
     "We do not offer every plan available in your area. Any information we "
     "provide is limited to those plans we do offer in your area. Please contact "
     "Medicare.gov or 1-800-MEDICARE to get information on all of your options.",
     "2022-01-01", None,
     "42 CFR 422.2267(e)(41) (2023 form); CMS informal guidance re anonymous pages", 0),
]

AGENCY = "abridge-demo"
PY = 2027

# Two parent orgs the agency carries, one it does not -> sells_all must be 0.
LANDSCAPE = [
    # parent_org_id, name, contract, pbp, segment, county_fips, state
    ("PO_A", "Org A", "H1111", "001", "000", "48085", "TX"),
    ("PO_A", "Org A", "H1111", "002", "000", "48085", "TX"),
    ("PO_A", "Org A", "H1111", "002", "001", "48085", "TX"),   # segmented plan
    ("PO_B", "Org B", "H2222", "001", "000", "48085", "TX"),
    ("PO_C", "Org C", "H3333", "001", "000", "48085", "TX"),   # NOT appointed
    ("PO_A", "Org A", "H1111", "001", "000", "48181", "TX"),
    ("PO_B", "Org B", "H2222", "001", "000", "48181", "TX"),
    ("PO_D", "Org D", "H4444", "001", "000", "48113", "TX"),   # Dallas, not appointed
]

APPOINTMENTS = [
    # parent_org, contract, state, rts, from, to
    ("PO_A", "H1111", "TX", 1, "2026-08-01", None),
    ("PO_B", "H2222", "TX", 1, "2026-08-01", None),
    ("PO_E", "H5555", "TX", 0, "2026-08-01", None),   # appointed but NOT ready-to-sell
]

ZIPS = [
    # 75058 spans Grayson (48181) and Collin (48085) -- the ambiguity case
    ("75058", "48181", "Grayson", "TX"),
    ("75058", "48085", "Collin", "TX"),
    ("75009", "48085", "Collin", "TX"),
    ("75201", "48113", "Dallas", "TX"),
    ("99999", "48999", "Nowhere", "TX"),   # county with no counts row
]


def build(path: str = ":memory:", feed_age_hours: int = 1,
          anchor: datetime = datetime(2026, 10, 15, 12)) -> sqlite3.Connection:
    conn = sqlite3.connect(path)
    conn.executescript(Path(__file__).with_name("schema.sql").read_text())

    conn.executemany("INSERT INTO disclaimer_variants VALUES (?,?,?,?,?,?,?,?)", VARIANTS)
    conn.executemany(
        "INSERT INTO cms_plan_landscape (parent_org_id,parent_org_name,contract_id,pbp,"
        "segment,county_fips,state,plan_year,snapshot_id) VALUES (?,?,?,?,?,?,?,?,?)",
        [(*row, PY, "cms_2027_oct") for row in LANDSCAPE])
    conn.executemany(
        "INSERT INTO agency_appointments (agency_id,plan_year,parent_org_id,contract_id,"
        "state,rts,effective_from,effective_to,source_doc_hash,ingested_at) "
        "VALUES (?,?,?,?,?,?,?,?,?,?)",
        [(AGENCY, PY, po, c, st, rts, f, t, "sha256:fixture", "2026-08-30T00:00:00")
         for po, c, st, rts, f, t in APPOINTMENTS])
    conn.executemany("INSERT INTO zip_county VALUES (?,?,?,?)", ZIPS)
    conn.execute("INSERT INTO appointment_feed_status VALUES (?,?,?)",
                 (AGENCY, (anchor - timedelta(hours=feed_age_hours)).isoformat(), 48))
    conn.commit()
    return conn
