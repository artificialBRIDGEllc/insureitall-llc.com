/** Carrier-audit copy. Source: Ryan Butterfield, acting CCO, 2026-08-20.
 *  Confirm / replace on docs/cco-confirmation.md before treating counts as zip-level. */

export const TPMO_ORG_COUNT = 14;

/**
 * Zip-specific in production. Static figure until Ryan confirms the
 * contracted product count for the disclaimer. One-line change.
 */
export const TPMO_PRODUCT_COUNT = 14;

export const TPMO_DISCLAIMER = `We do not offer every plan available in your area. Currently we represent ${TPMO_ORG_COUNT} organizations which offer ${TPMO_PRODUCT_COUNT} products in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov, 1-800-MEDICARE, or your local State Health Insurance Program (SHIP) to get information on all of your options.`;

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
