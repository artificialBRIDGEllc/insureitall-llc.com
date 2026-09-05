"""
bridge_disclosure.resolver -- ZIP -> CMS TPMO disclaimer, with evidence.

Governing reg: 42 CFR 422.2267(e)(41) (MA) and 423.2267(e)(41) (Part D).
Standardized content: the text must be served verbatim. All text lives in the
disclaimer_variants table, never as a literal in this file.

Two rules dominate this module:
  1. FAIL CLOSED. A stale, missing, or unresolvable input renders the generic
     no-numbers variant. A wrong number is a violation; a generic disclaimer is not.
  2. NO REQUEST-TIME COUNTING. Counts come from the materialized table only.
"""

from __future__ import annotations

import hashlib
import json
import sqlite3
from dataclasses import dataclass, asdict, field
from datetime import datetime, date, timedelta
from typing import Optional

GENESIS_HASH = "0" * 64


# ---------------------------------------------------------------------------
# Result type
# ---------------------------------------------------------------------------

@dataclass
class DisclosureResult:
    status: str                       # OK | AMBIGUOUS_ZIP | FALLBACK_GENERIC
    text: str                         # the exact string to render, verbatim
    reason: Optional[str] = None      # why we fell back / why ambiguous
    orgs: Optional[int] = None
    products: Optional[int] = None
    county_fips: Optional[str] = None
    plan_year: Optional[int] = None
    variant_id: Optional[str] = None
    snapshot_id: Optional[str] = None
    evidence_hash: Optional[str] = None
    candidate_counties: list = field(default_factory=list)  # for the county picker


# ---------------------------------------------------------------------------
# Plan year selection
# ---------------------------------------------------------------------------

def marketing_plan_year(on: date) -> int:
    """MA orgs may begin marketing next contract year on Oct 1 (42 CFR 422.2263(a)).

    From Oct 1 to Dec 31 a site markets NEXT year's plans while THIS year's are
    still in force -- two valid count sets. The caller must say which page context
    it is in; this is only the default for marketing pages.
    """
    return on.year + 1 if (on.month, on.day) >= (10, 1) else on.year


# ---------------------------------------------------------------------------
# Count materialization (batch job -- runs nightly, not per request)
# ---------------------------------------------------------------------------

def recompute_counts(conn: sqlite3.Connection, agency_id: str, plan_year: int,
                     as_of: date, snapshot_id: str) -> int:
    """Join public landscape x proprietary appointments -> per-county counts.

    organizations = distinct parent_org_id
    products      = distinct (contract_id, pbp, segment)

    OPEN ITEM (ADR required): whether segmented plans count as one product or
    several. Counted separately here. Confirm in writing with carrier compliance
    before this number reaches a beneficiary.
    """
    cur = conn.cursor()
    cur.execute("DELETE FROM disclosure_counts WHERE agency_id=? AND plan_year=?",
                (agency_id, plan_year))

    rows = cur.execute(
        """
        SELECT l.county_fips,
               COUNT(DISTINCT l.parent_org_id)                            AS orgs,
               COUNT(DISTINCT l.contract_id || '|' || l.pbp || '|' || l.segment) AS products
        FROM cms_plan_landscape l
        JOIN agency_appointments a
          ON  a.plan_year   = l.plan_year
          AND a.contract_id = l.contract_id
          AND a.state       = l.state
        WHERE l.plan_year = ?
          AND a.agency_id  = ?
          AND a.rts = 1
          AND a.effective_from <= ?
          AND (a.effective_to IS NULL OR a.effective_to >= ?)
        GROUP BY l.county_fips
        """,
        (plan_year, agency_id, as_of.isoformat(), as_of.isoformat()),
    ).fetchall()

    # "sells_all" = the agency is appointed for every parent org available in
    # that county. Drives which of the two standardized variants applies.
    total = {r[0]: r[1] for r in cur.execute(
        "SELECT county_fips, COUNT(DISTINCT parent_org_id) FROM cms_plan_landscape "
        "WHERE plan_year=? GROUP BY county_fips", (plan_year,)).fetchall()}

    now = datetime.utcnow().isoformat()
    written = 0
    for county, orgs, products in rows:
        sells_all = 1 if total.get(county, 0) == orgs else 0
        cur.execute(
            "INSERT INTO disclosure_counts VALUES (?,?,?,?,?,?,?,?)",
            (agency_id, plan_year, county, orgs, products, sells_all, snapshot_id, now),
        )
        written += 1
    conn.commit()
    return written


# ---------------------------------------------------------------------------
# Variant selection
# ---------------------------------------------------------------------------

def _pick_variant(conn, sells_all: int, numeric: int, on: date):
    return conn.execute(
        """
        SELECT variant_id, text FROM disclaimer_variants
        WHERE sells_all = ? AND numeric = ?
          AND effective_from <= ?
          AND (effective_to IS NULL OR effective_to >= ?)
        ORDER BY effective_from DESC LIMIT 1
        """,
        (sells_all, numeric, on.isoformat(), on.isoformat()),
    ).fetchone()


def _generic(conn, on: date, reason: str, **kw) -> DisclosureResult:
    """Fail-closed path: the no-numbers variant. Never a stale number."""
    row = _pick_variant(conn, sells_all=0, numeric=0, on=on)
    if row is None:
        # No lawful text at all for this date. Refuse rather than invent one.
        raise RuntimeError(
            f"No effective generic disclaimer variant for {on}. "
            "Load a variant row before serving traffic."
        )
    return DisclosureResult(status="FALLBACK_GENERIC", text=row[1],
                            reason=reason, variant_id=row[0], **kw)


# ---------------------------------------------------------------------------
# Evidence chain
# ---------------------------------------------------------------------------

def _append_event(conn, agency_id: str, zip_code: Optional[str],
                  result: DisclosureResult, at: datetime) -> str:
    prev = conn.execute("SELECT hash FROM render_events ORDER BY seq DESC LIMIT 1").fetchone()
    prev_hash = prev[0] if prev else GENESIS_HASH

    payload = {
        "rendered_at": at.isoformat(),
        "agency_id": agency_id,
        "zip": zip_code,
        "county_fips": result.county_fips,
        "plan_year": result.plan_year,
        "status": result.status,
        "reason": result.reason,
        "variant_id": result.variant_id,
        "org_count": result.orgs,
        "product_count": result.products,
        "text_served": result.text,
        "snapshot_id": result.snapshot_id,
        "prev_hash": prev_hash,
    }
    digest = hashlib.sha256(
        json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    ).hexdigest()

    conn.execute(
        "INSERT INTO render_events (rendered_at,agency_id,zip,county_fips,plan_year,"
        "status,reason,variant_id,org_count,product_count,text_served,snapshot_id,"
        "prev_hash,hash) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        (payload["rendered_at"], agency_id, zip_code, result.county_fips,
         result.plan_year, result.status, result.reason, result.variant_id,
         result.orgs, result.products, result.text, result.snapshot_id,
         prev_hash, digest),
    )
    conn.commit()
    return digest


def verify_chain(conn: sqlite3.Connection) -> bool:
    """Audit walkthrough: recompute every link. Any edit to history breaks this."""
    prev_hash = GENESIS_HASH
    for r in conn.execute("SELECT * FROM render_events ORDER BY seq ASC"):
        (_seq, rendered_at, agency_id, zip_code, county, plan_year, status, reason,
         variant_id, orgs, products, text_served, snapshot_id, stored_prev, stored_hash) = r
        if stored_prev != prev_hash:
            return False
        payload = {
            "rendered_at": rendered_at, "agency_id": agency_id, "zip": zip_code,
            "county_fips": county, "plan_year": plan_year, "status": status,
            "reason": reason, "variant_id": variant_id, "org_count": orgs,
            "product_count": products, "text_served": text_served,
            "snapshot_id": snapshot_id, "prev_hash": stored_prev,
        }
        if hashlib.sha256(json.dumps(payload, sort_keys=True,
                                     separators=(",", ":")).encode()).hexdigest() != stored_hash:
            return False
        prev_hash = stored_hash
    return True


# ---------------------------------------------------------------------------
# The resolver
# ---------------------------------------------------------------------------

def resolve_disclosure(conn: sqlite3.Connection, agency_id: str, zip_code: str,
                       render_at: Optional[datetime] = None,
                       plan_year: Optional[int] = None,
                       county_fips: Optional[str] = None,
                       record: bool = True) -> DisclosureResult:
    at = render_at or datetime.utcnow()
    on = at.date()
    py = plan_year or marketing_plan_year(on)

    def finish(res: DisclosureResult) -> DisclosureResult:
        if record:
            res.evidence_hash = _append_event(conn, agency_id, zip_code, res, at)
        return res

    # -- Gate 1: feed liveness. Stale appointments -> counts may be wrong. -----
    fs = conn.execute("SELECT last_success_at, max_age_hours FROM appointment_feed_status "
                      "WHERE agency_id=?", (agency_id,)).fetchone()
    if fs is None:
        return finish(_generic(conn, on, "NO_FEED_STATUS", plan_year=py))
    last_ok = datetime.fromisoformat(fs[0])
    if at - last_ok > timedelta(hours=fs[1]):
        return finish(_generic(conn, on, "STALE_APPOINTMENT_FEED", plan_year=py))

    # -- Gate 2: ZIP resolution ------------------------------------------------
    counties = conn.execute(
        "SELECT county_fips, county_name, state FROM zip_county WHERE zip=? ORDER BY county_fips",
        (zip_code,)).fetchall()
    if not counties:
        return finish(_generic(conn, on, "UNRESOLVED_ZIP", plan_year=py))

    if county_fips:
        match = [c for c in counties if c[0] == county_fips]
        if not match:
            return finish(_generic(conn, on, "COUNTY_NOT_IN_ZIP", plan_year=py))
        chosen = match[0][0]
    elif len(counties) > 1:
        # 42 CFR 422.2265 permits asking for county. Ask -- do not guess, do not
        # average, do not take the largest. Serve generic text while asking.
        res = _generic(conn, on, "MULTI_COUNTY_ZIP_NEEDS_SELECTION", plan_year=py)
        res.status = "AMBIGUOUS_ZIP"
        res.candidate_counties = [{"fips": c[0], "name": c[1], "state": c[2]} for c in counties]
        return finish(res)
    else:
        chosen = counties[0][0]

    # -- Gate 3: materialized counts must exist for this county/year ----------
    row = conn.execute(
        "SELECT org_count, product_count, sells_all, snapshot_id FROM disclosure_counts "
        "WHERE agency_id=? AND plan_year=? AND county_fips=?",
        (agency_id, py, chosen)).fetchone()
    if row is None:
        return finish(_generic(conn, on, "NO_SNAPSHOT_FOR_COUNTY",
                               county_fips=chosen, plan_year=py))
    orgs, products, sells_all, snapshot_id = row
    if orgs == 0 or products == 0:
        return finish(_generic(conn, on, "ZERO_REPRESENTATION",
                               county_fips=chosen, plan_year=py))

    # -- Gate 4: an effective numeric variant must exist for this render date --
    variant = _pick_variant(conn, sells_all=sells_all, numeric=1, on=on)
    if variant is None:
        return finish(_generic(conn, on, "NO_EFFECTIVE_VARIANT",
                               county_fips=chosen, plan_year=py))
    variant_id, template = variant

    return finish(DisclosureResult(
        status="OK",
        text=template.format(orgs=orgs, products=products),
        orgs=orgs, products=products, county_fips=chosen, plan_year=py,
        variant_id=variant_id, snapshot_id=snapshot_id,
    ))


def to_json(res: DisclosureResult) -> str:
    return json.dumps(asdict(res), indent=2)
