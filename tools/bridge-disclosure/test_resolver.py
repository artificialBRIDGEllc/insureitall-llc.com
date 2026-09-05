"""Acceptance suite. Passing = the join is right and the safety rule holds."""

from datetime import datetime, date
import seed
from resolver import (resolve_disclosure, recompute_counts, marketing_plan_year,
                      verify_chain)

RENDER_AT = datetime(2026, 9, 15, 12, 0, 0)   # inside CY2027 marketing window (post Oct 1? no)
AEP_AT    = datetime(2026, 10, 15, 12, 0, 0)  # AEP: marketing next plan year
PRE       = datetime(2026, 6, 1, 12, 0, 0)    # before the SHIP-removal boundary

results = []


def check(name, cond, detail=""):
    results.append((name, bool(cond), detail))


def fresh(feed_age_hours=1):
    conn = seed.build(feed_age_hours=feed_age_hours)
    recompute_counts(conn, seed.AGENCY, seed.PY, date(2026, 9, 1), "cms_2027_oct")
    return conn


# --- 1. The join: counts reflect appointments x landscape, not the whole market
conn = fresh()
r = resolve_disclosure(conn, seed.AGENCY, "75009", render_at=AEP_AT, plan_year=2027)
check("collin_status_ok", r.status == "OK", r.status)
check("collin_orgs_is_2_not_3", r.orgs == 2,
      f"orgs={r.orgs} (PO_C exists in county but is not appointed)")
check("collin_products_is_4", r.products == 4,
      f"products={r.products} (H1111/001/000, H1111/002/000, H1111/002/001, "
      f"H2222/001/000 -- H3333 excluded, not appointed)")
check("uses_partial_variant", r.variant_id == "v2027_partial", r.variant_id)
check("no_ship_in_text", "SHIP" not in r.text, r.text[-70:])
check("text_has_numbers", "2 organizations" in r.text and "4 products" in r.text, r.text)

# --- 2. Not-ready-to-sell must not count
check("rts_gate_holds", "PO_E" not in r.text and r.orgs == 2, "H5555 rts=0 excluded")

# --- 3. Multi-county ZIP: ask, never guess
r2 = resolve_disclosure(conn, seed.AGENCY, "75058", render_at=AEP_AT, plan_year=2027)
check("multicounty_is_ambiguous", r2.status == "AMBIGUOUS_ZIP", r2.status)
check("multicounty_serves_generic", r2.orgs is None and "Any information we provide" in r2.text)
check("multicounty_offers_choice", len(r2.candidate_counties) == 2,
      str([c["name"] for c in r2.candidate_counties]))

# --- 4. County selection resolves it, and the two counties differ
r3 = resolve_disclosure(conn, seed.AGENCY, "75058", render_at=AEP_AT,
                        plan_year=2027, county_fips="48181")
check("county_pick_resolves", r3.status == "OK", r3.status)
check("grayson_differs_from_collin", (r3.orgs, r3.products) == (2, 2),
      f"grayson={r3.orgs}/{r3.products} vs collin=2/3")

# --- 5. County with plans but zero representation -> fail closed, not "0 organizations"
r4 = resolve_disclosure(conn, seed.AGENCY, "75201", render_at=AEP_AT, plan_year=2027)
check("zero_rep_fails_closed", r4.status == "FALLBACK_GENERIC", f"{r4.status}/{r4.reason}")
check("zero_rep_no_zero_string", "0 organizations" not in r4.text)

# --- 6. Unresolvable / uncovered ZIP
r5 = resolve_disclosure(conn, seed.AGENCY, "00000", render_at=AEP_AT, plan_year=2027)
check("unknown_zip_fails_closed", r5.reason == "UNRESOLVED_ZIP", r5.reason)
r6 = resolve_disclosure(conn, seed.AGENCY, "99999", render_at=AEP_AT, plan_year=2027)
check("no_snapshot_fails_closed", r6.reason == "NO_SNAPSHOT_FOR_COUNTY", r6.reason)

# --- 7. STALE FEED: the single most important rule. Never a stale number.
stale = fresh(feed_age_hours=96)
r7 = resolve_disclosure(stale, seed.AGENCY, "75009", render_at=AEP_AT, plan_year=2027)
check("stale_feed_fails_closed", r7.reason == "STALE_APPOINTMENT_FEED", f"{r7.status}/{r7.reason}")
check("stale_feed_shows_no_number", r7.orgs is None and "organizations which offer" not in r7.text)

# --- 8. Text is data: the boundary selects the variant, no deploy needed
r8 = resolve_disclosure(conn, seed.AGENCY, "75009", render_at=PRE, plan_year=2027)
check("pre_boundary_uses_ship_variant", r8.variant_id == "v2024_partial_ship", r8.variant_id)
check("pre_boundary_text_has_ship", "SHIP" in r8.text)

# --- 9. Plan-year switch on Oct 1
check("py_before_oct1", marketing_plan_year(date(2026, 9, 30)) == 2026)
check("py_on_oct1", marketing_plan_year(date(2026, 10, 1)) == 2027)

# --- 10. Evidence chain intact and tamper-evident
check("chain_verifies", verify_chain(conn))
conn.execute("UPDATE render_events SET org_count = 99 WHERE seq = 1")
check("chain_detects_tampering", verify_chain(conn) is False)

# ---------------------------------------------------------------------------
passed = sum(1 for _, ok, _ in results if ok)
print(f"\n{'RESULT':<8} {'CHECK':<34} DETAIL")
print("-" * 92)
for name, ok, detail in results:
    print(f"{'PASS' if ok else 'FAIL':<8} {name:<34} {detail}")
print("-" * 92)
print(f"{passed}/{len(results)} checks passed\n")

print("Sample served string (Collin County, CY2027):")
print(f"  {r.text}\n")
print(f"Evidence hash: {r.evidence_hash}")
raise SystemExit(0 if passed == len(results) else 1)
