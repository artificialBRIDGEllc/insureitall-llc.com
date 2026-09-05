-- bridge_disclosure schema v0.1
-- Source of truth for the CMS TPMO disclaimer (42 CFR 422.2267(e)(41) / 423.2267(e)(41)).
-- Design rule: counts are PRECOMPUTED into disclosure_counts. Nothing counts at request time.

-- ---------------------------------------------------------------------------
-- 1. PUBLIC DATA. Refreshed from CMS plan landscape drops. Not proprietary.
-- ---------------------------------------------------------------------------
CREATE TABLE cms_plan_landscape (
    plan_year      INTEGER NOT NULL,
    parent_org_id  TEXT    NOT NULL,   -- counted for "organizations"
    parent_org_name TEXT   NOT NULL,
    contract_id    TEXT    NOT NULL,   -- H####/S####/R####
    pbp            TEXT    NOT NULL,   -- plan benefit package
    segment        TEXT    NOT NULL DEFAULT '000',
    county_fips    TEXT    NOT NULL,   -- 5-digit; MA service areas are county-keyed
    state          TEXT    NOT NULL,
    snapshot_id    TEXT    NOT NULL,   -- which CMS drop this row came from
    PRIMARY KEY (plan_year, contract_id, pbp, segment, county_fips)
);

-- ---------------------------------------------------------------------------
-- 2. PROPRIETARY DATA. This is the asset. Fed from carrier appointment exports.
--    "Appointed" is not enough on its own -- ready-to-sell gates the count.
-- ---------------------------------------------------------------------------
CREATE TABLE agency_appointments (
    agency_id      TEXT    NOT NULL,
    plan_year      INTEGER NOT NULL,
    parent_org_id  TEXT    NOT NULL,
    contract_id    TEXT    NOT NULL,
    state          TEXT    NOT NULL,   -- appointments are state-scoped, plans are county-scoped
    rts            INTEGER NOT NULL,   -- 1 = ready to sell
    effective_from TEXT    NOT NULL,   -- ISO date
    effective_to   TEXT,               -- ISO date or NULL = open
    source_doc_hash TEXT   NOT NULL,   -- provenance back to the carrier export
    ingested_at    TEXT    NOT NULL,
    PRIMARY KEY (agency_id, plan_year, contract_id, state, effective_from)
);

-- Feed liveness. Staleness here forces a fail-closed render.
CREATE TABLE appointment_feed_status (
    agency_id       TEXT PRIMARY KEY,
    last_success_at TEXT NOT NULL,
    max_age_hours   INTEGER NOT NULL DEFAULT 48
);

-- ---------------------------------------------------------------------------
-- 3. ZIP -> COUNTY crosswalk. ~1 in 5 ZIPs crosses a county line.
-- ---------------------------------------------------------------------------
CREATE TABLE zip_county (
    zip         TEXT NOT NULL,
    county_fips TEXT NOT NULL,
    county_name TEXT NOT NULL,
    state       TEXT NOT NULL,
    PRIMARY KEY (zip, county_fips)
);

-- ---------------------------------------------------------------------------
-- 4. MATERIALIZED COUNTS. Recomputed nightly and on any appointment change.
-- ---------------------------------------------------------------------------
CREATE TABLE disclosure_counts (
    agency_id     TEXT    NOT NULL,
    plan_year     INTEGER NOT NULL,
    county_fips   TEXT    NOT NULL,
    org_count     INTEGER NOT NULL,
    product_count INTEGER NOT NULL,
    sells_all     INTEGER NOT NULL,   -- drives which disclaimer variant applies
    snapshot_id   TEXT    NOT NULL,
    computed_at   TEXT    NOT NULL,
    PRIMARY KEY (agency_id, plan_year, county_fips)
);

-- ---------------------------------------------------------------------------
-- 5. DISCLAIMER TEXT AS DATA, NOT AS A CODE LITERAL.
--    CMS amended this reg in Apr 2026. It will move again. A text change must
--    be a row, not a deploy.
-- ---------------------------------------------------------------------------
CREATE TABLE disclaimer_variants (
    variant_id     TEXT PRIMARY KEY,
    sells_all      INTEGER NOT NULL,  -- 0 = "We do not offer every plan..."; 1 = the all-plans form
    numeric        INTEGER NOT NULL,  -- 1 = requires org/product counts; 0 = generic fallback
    text           TEXT    NOT NULL,  -- {orgs} / {products} placeholders
    effective_from TEXT    NOT NULL,
    effective_to   TEXT,
    source_citation TEXT   NOT NULL,
    confirmed      INTEGER NOT NULL DEFAULT 0  -- 0 = boundary not yet confirmed against the final rule
);

-- ---------------------------------------------------------------------------
-- 6. EVIDENCE. Every render is an audit record. Hash-chained.
-- ---------------------------------------------------------------------------
CREATE TABLE render_events (
    seq           INTEGER PRIMARY KEY AUTOINCREMENT,
    rendered_at   TEXT    NOT NULL,
    agency_id     TEXT    NOT NULL,
    zip           TEXT,
    county_fips   TEXT,
    plan_year     INTEGER,
    status        TEXT    NOT NULL,   -- OK | AMBIGUOUS_ZIP | FALLBACK_GENERIC
    reason        TEXT,
    variant_id    TEXT,
    org_count     INTEGER,
    product_count INTEGER,
    text_served   TEXT    NOT NULL,   -- the exact string the beneficiary saw
    snapshot_id   TEXT,
    prev_hash     TEXT    NOT NULL,
    hash          TEXT    NOT NULL
);

CREATE INDEX idx_landscape_county ON cms_plan_landscape (plan_year, county_fips);
CREATE INDEX idx_appt_lookup ON agency_appointments (agency_id, plan_year, state);
CREATE INDEX idx_events_time ON render_events (rendered_at);
