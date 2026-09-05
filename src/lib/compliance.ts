/**
 * TPMO disclaimer — 42 CFR 422.2267(e)(41) / 423.2267(e)(41).
 *
 * Interim generic (no-numbers) form. See docs/decisions/ADR-0013-tpmo-disclaimer-stopgap.md.
 * The prior string spliced two non-standardized sentences together and stated a static
 * 14-organizations/14-products count with no source that could withstand a carrier or
 * CMS audit request (docs/audits/AUDIT-insureitall-2026-09-03.md, findings F1/F2). CMS's
 * standardized text requires the count blanks to be filled in — there is no verbatim
 * "no-numbers" form in the regulation — so this generic sentence is a defensible interim
 * posture (discloses non-exclusivity, drops any unprovable number), NOT verified CMS
 * standardized content. It still needs Ryan Butterfield's (acting CCO) sign-off per
 * docs/cco-confirmation.md.
 *
 * The numeric variant is staged and tested in tools/bridge-disclosure/ (resolver.py,
 * schema.sql) for the day real per-county appointment data lands — swap this constant
 * for that resolver's output then, do not hand-edit a new static pair back in.
 *
 * SHIP is intentionally omitted: CMS removed the SHIP referral from the standardized
 * text at 91 FR 17583 (Apr 6, 2026, CMS-4208-F3 / RIN 0938-AV40, Fed. Reg. doc
 * 2026-06600), effective for CY2027 marketing beginning Oct 1, 2026. Omitting it now
 * is compliant under both the pre- and post-amendment text.
 */
export const TPMO_DISCLAIMER =
  "We do not offer every plan available in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.";

export const NON_AFFILIATION =
  "Insure It All is not connected with or endorsed by the U.S. Government or the federal Medicare program.";

export const LEAD_CONSENT =
  "By checking this box and submitting, I provide my express written consent for a licensed insurance agent from INSUREitALL to contact me at the phone number and email provided to discuss Medicare Advantage, Medicare Supplement, and Prescription Drug Plans, including by phone, email, and text message, and including through automated technology, autodialed and prerecorded calls and texts. Consent is not a condition of purchase. Message and data rates may apply; message frequency varies. Reply STOP to opt out or HELP for help. Calls to and from INSUREitALL are recorded and monitored for quality, training, and compliance purposes.";

export const LICENSED_STATES = [
  "AK",
  "AL",
  "AR",
  "AZ",
  "CO",
  "CT",
  "FL",
  "GA",
  "HI",
  "IA",
  "ID",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "NC",
  "ND",
  "NE",
  "NH",
  "NJ",
  "OH",
  "OK",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VA",
  "VT",
  "WA",
  "WY",
] as const;

export const LICENSED_STATE_COUNT = LICENSED_STATES.length;

export const LICENSED_STATES_LINE = `Licensed in ${LICENSED_STATE_COUNT} states: ${LICENSED_STATES.join(", ")}`;
