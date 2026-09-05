# bridge_disclosure v0.1

ZIP → CMS TPMO disclaimer, with evidence. 24/24 acceptance checks passing.

Governing reg: 42 CFR 422.2267(e)(41) (MA), 423.2267(e)(41) (Part D).

## Run

```bash
python3 test_resolver.py
```

## Two rules the code enforces

1. **Fail closed.** Stale feed, unresolvable ZIP, missing snapshot, zero
   representation, or no effective text variant → the generic no-numbers
   disclaimer. Never a stale or zero number. A wrong number is a violation;
   a generic disclaimer is not.
2. **No request-time counting.** Counts come only from `disclosure_counts`,
   materialized by `recompute_counts()`.

## Gate order in `resolve_disclosure()`

```
feed freshness → ZIP resolution → county disambiguation
  → materialized counts → effective text variant → render → evidence event
```

Any gate failing short-circuits to generic. Every outcome — including every
fallback — writes a hash-chained `render_events` row. `verify_chain()` is the
audit walkthrough; the suite proves it detects a single mutated field.

## Text is data, not code

`disclaimer_variants` holds every lawful string with `effective_from` /
`effective_to`. The Apr 2026 amendment (91 FR 17583, SHIP removed) is a row,
not a deploy. The suite proves a June 2026 render serves the SHIP variant and
an October 2026 render serves the current one, from the same binary.

**Resolved 2026-09-05:** `SHIP_REMOVAL_EFFECTIVE` (`2026-10-01`) is confirmed
against Cornell LII's current text of 42 CFR 422.2267 and the Federal Register
(CMS-4208-F3/CMS-4212-F, 91 FR 17384-17602 at 17583, doc 2026-06600, 4/6/2026).
`v2027_partial` / `v2027_all` are verbatim against that source. `confirmed=1`
in `seed.py`.

**Still open:** the generic no-numbers fallback text (`v_generic_nonumbers`,
`confirmed=0`) traces to the 2023 form of the reg plus informal industry
practice for anonymous landing pages that collect no ZIP — no independent CMS
source was found for a no-numbers standardized variant, because the
regulation's standardized text always requires the count blanks filled in.
It is the string served on every fail-closed path and the one now live on
insureitall-llc.com as the interim stopgap (see
`docs/decisions/ADR-0013-tpmo-disclaimer-stopgap.md`). It is the safer of the
two available positions, not a verified one — needs Ryan Butterfield's
(acting CCO) sign-off per `docs/cco-confirmation.md`.

## Carrier export ingest contract

This is the long pole and the actual asset. Every carrier export must land in
`agency_appointments` with these fields resolved:

| Field | Notes |
|---|---|
| `parent_org_id` | Parent organization, **not** contract, **not** marketing brand. This is what "organizations" counts. |
| `contract_id` | H/S/R number. The join key to CMS landscape. Brand names will not join. |
| `state` | Appointments are state-scoped; plans are county-scoped. This asymmetry is the whole reason the join is non-trivial. |
| `rts` | Ready-to-sell. Appointed-but-not-RTS must not count. Proven by the `rts_gate_holds` check. |
| `effective_from` / `effective_to` | Mid-year appointment changes are the main source of drift. |
| `source_doc_hash` | Provenance back to the export file. Required for audit. |

One adapter per carrier. The adapter library is the part that compounds and
cannot be bought — normalizing brand names to parent orgs and contract IDs
across a dozen inconsistent export formats is the moat, not this resolver.

## ADR-001 — Multi-county ZIPs

**Status:** Accepted
**Context:** ~1 in 5 ZIPs crosses a county line. MA service areas are
county-keyed, so one ZIP can have two different correct counts. Collin vs
Grayson in the fixture: 2/4 vs 2/2.
**Decision:** Return `AMBIGUOUS_ZIP` with candidate counties and serve generic
text while asking. 42 CFR 422.2265 permits requiring county entry.
**Alternatives:** union (overstates representation), intersection
(understates), largest-population county (fabricates a location), weighted
average (produces a number true of nowhere).
**Reasoning:** Every non-asking option puts an unprovable number in front of a
beneficiary. Asking is explicitly permitted.
**Tradeoffs:** Friction on ~20% of visitors. Tripwire: revisit if picker
abandonment exceeds 15%.
**Reversibility:** Easy — one branch in `resolve_disclosure`.

## ADR-002 — Segmented plans counted separately

**Status:** Proposed — **not** accepted.
`recompute_counts` counts `(contract_id, pbp, segment)` as distinct products.
Whether CMS intends segments as separate "products" is genuinely ambiguous.
Get it in writing from carrier compliance before this number reaches a
beneficiary. Changing it is one line in the `COUNT(DISTINCT ...)`.

## Not built

Website widget, CDN cache-invalidation on count change, multi-tenant auth,
Part D-only path, real ZIP crosswalk (fixture has 5 ZIPs), alerting on
fail-closed rate. All downstream of the ingest contract above.
