/**
 * HIPAA Safe Harbor de-identification — 45 CFR § 164.514(b)(2).
 *
 * Individual-level records may be used for training only after these
 * identifiers are removed, and we have no actual knowledge the rest
 * could identify the person. Expert determination and limited data
 * sets are not used.
 *
 * Voice recordings are biometric identifiers (item 16). This path
 * never stores audio — text only, after this pass.
 */

export const SAFE_HARBOR_CFR = "45 CFR 164.514(b)(2)";

/** 3-digit ZCTAs HHS treats as ≤20,000 people. Full zip and these 3-digit codes are stripped. */
export const RESTRICTED_ZIP3 = new Set([
  "036",
  "059",
  "063",
  "102",
  "203",
  "556",
  "692",
  "790",
  "821",
  "823",
  "830",
  "831",
  "878",
  "879",
  "884",
  "890",
  "893",
]);

export const SAFE_HARBOR_IDENTIFIERS = [
  { n: 1, name: "Names", token: "[name]" },
  { n: 2, name: "Geographic subdivisions smaller than a state", token: "[geo]" },
  { n: 3, name: "Dates (except year) and ages 90+", token: "[date]" },
  { n: 4, name: "Telephone numbers", token: "[phone]" },
  { n: 5, name: "Fax numbers", token: "[fax]" },
  { n: 6, name: "Email addresses", token: "[email]" },
  { n: 7, name: "Social Security numbers", token: "[ssn]" },
  { n: 8, name: "Medical record numbers", token: "[mrn]" },
  { n: 9, name: "Health plan beneficiary numbers, including MBI", token: "[mbi]" },
  { n: 10, name: "Account numbers", token: "[account]" },
  { n: 11, name: "Certificate / license numbers", token: "[license]" },
  { n: 12, name: "Vehicle identifiers and license plates", token: "[vehicle]" },
  { n: 13, name: "Device identifiers and serial numbers", token: "[device]" },
  { n: 14, name: "Web URLs", token: "[url]" },
  { n: 15, name: "IP addresses", token: "[ip]" },
  { n: 16, name: "Biometric identifiers (including voiceprints)", token: "[bio]" },
  { n: 17, name: "Full-face photographs and comparable images", token: "[photo]" },
  { n: 18, name: "Any other unique identifying number, characteristic, or code", token: "[id]" },
];

const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]{2,}/g;
const PHONE = /\b(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
const FAX = /\bfax(?:\s*(?:number|#|no\.?))?\s*[:#]?\s*(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/gi;
const SSN = /\b\d{3}-\d{2}-\d{4}\b/g;
const MBI =
  /\b[1-9][AC-HJKMNPQRTUVWXY][AC-HJKMNPQRTUVWXY0-9][0-9][AC-HJKMNPQRTUVWXY][AC-HJKMNPQRTUVWXY0-9][0-9][AC-HJKMNPQRTUVWXY]{2}[0-9]{2}\b/gi;
const ZIP = /\b(\d{5})(?:-\d{4})?\b/g;
const IP = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
const URL = /\bhttps?:\/\/\S+/gi;
const DATE_SLASH = /\b(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})\b/g;
const DATE_MONTH =
  /\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s*(\d{4}))?\b/gi;
const DOB = /\b(?:d\.?o\.?b\.?|date of birth|born(?: on)?)\s*:?\s*[^\s,.]{1,40}/gi;
const ADDRESS =
  /\b\d{1,6}\s+[A-Za-z0-9.'-]+(?:\s+[A-Za-z0-9.'-]+){0,4}\s+(?:st|street|ave|avenue|rd|road|ln|lane|blvd|dr|drive|ct|court|way|pkwy|circle|cir|place|pl)\.?\b/gi;
const CITY_STATE = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?,\s*([A-Z]{2})\b/g;
const COUNTY = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+County\b/g;
const DOCTOR =
  /\b(?:Dr|Doctor|Physician|PCP|dr|doctor|physician|pcp)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g;
const NAME_INTRO = /\b(?:[Mm]y name is|[Ii] am|[Ii]'m)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g;
const MRN = /\b(?:mrn|medical record)\s*(?:number|#|no\.?)?\s*[:#]?\s*[A-Z0-9-]{4,}\b/gi;
const BENEFICIARY =
  /\b(?:mbi|hicn|medicare (?:id|number|beneficiary)|health plan (?:id|number)|member id)\s*[:#]?\s*[A-Z0-9-]{5,}\b/gi;
const ACCOUNT =
  /\b(?:account|acct|policy|claim|group)\s*(?:number|#|no\.?|id)?\s*[:#]?\s*[A-Z0-9-]{6,}\b/gi;
const LICENSE =
  /\b(?:npi|npn|dea|license(?: number)?)\s*[:#]?\s*[A-Z0-9-]{5,}\b/gi;
const VEHICLE =
  /\b(?:vin|license plate|plate)\s*[:#]?\s*[A-Z0-9-]{5,}\b/gi;
const DEVICE =
  /\b(?:serial(?: number)?|imei|udid|device id)\s*[:#]?\s*[A-Z0-9-]{6,}\b/gi;
const BIO = /\b(?:voiceprint|fingerprints?|retina scan|face scan|biometric)\b/gi;
const PHOTO = /\b(?:photo(?:graph)? of (?:my|his|her) face|selfie|full-face)\b/gi;
const AGE_90 = /\b(?:aged?|i(?:'| a)m)\s+(?:9\d|1\d{2})\b/gi;
const LONG_ID = /\b\d{9,}\b/g;
const SSN_PHRASE = /\b(?:ssn|social security(?: number)?)\b/gi;

function yearFloor() {
  return new Date().getFullYear() - 90;
}

function zipToken(five) {
  const three = String(five).slice(0, 3);
  return RESTRICTED_ZIP3.has(three) ? "[zip]" : three;
}

function yearToken(raw) {
  const year = raw.length === 2 ? 2000 + Number(raw) : Number(raw);
  if (!Number.isFinite(year)) return "[date]";
  if (year <= yearFloor()) return "[age90+]";
  return String(year);
}

/**
 * @param {string} value
 * @returns {{ text: string, dropped: boolean, hits: string[] }}
 */
export function safeHarborRedact(value) {
  let text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return { text: "", dropped: true, hits: [] };

  const hits = [];
  const mark = (id) => {
    if (!hits.includes(id)) hits.push(id);
  };

  const run = (pattern, token, id) => {
    pattern.lastIndex = 0;
    if (!pattern.test(text)) {
      pattern.lastIndex = 0;
      return;
    }
    pattern.lastIndex = 0;
    text = text.replace(pattern, token);
    mark(id);
  };

  run(EMAIL, "[email]", 6);
  run(URL, "[url]", 14);
  run(MRN, "[mrn]", 8);
  run(BENEFICIARY, "[mbi]", 9);
  run(ACCOUNT, "[account]", 10);
  run(LICENSE, "[license]", 11);
  run(VEHICLE, "[vehicle]", 12);
  run(DEVICE, "[device]", 13);
  run(FAX, "[fax]", 5);
  run(PHONE, "[phone]", 4);
  run(SSN, "[ssn]", 7);
  run(MBI, "[mbi]", 9);
  run(IP, "[ip]", 15);
  run(ADDRESS, "[address]", 2);
  run(COUNTY, "[county]", 2);
  run(DOB, "[dob]", 3);
  DATE_SLASH.lastIndex = 0;
  if (DATE_SLASH.test(text)) {
    DATE_SLASH.lastIndex = 0;
    text = text.replace(DATE_SLASH, (_m, _a, _b, y) => {
      mark(3);
      return yearToken(y);
    });
  }
  DATE_MONTH.lastIndex = 0;
  if (DATE_MONTH.test(text)) {
    DATE_MONTH.lastIndex = 0;
    text = text.replace(DATE_MONTH, (_m, y) => {
      mark(3);
      return y ? yearToken(y) : "[date]";
    });
  }
  ZIP.lastIndex = 0;
  if (ZIP.test(text)) {
    ZIP.lastIndex = 0;
    text = text.replace(ZIP, (_m, five) => {
      mark(2);
      return zipToken(five);
    });
  }
  CITY_STATE.lastIndex = 0;
  if (CITY_STATE.test(text)) {
    CITY_STATE.lastIndex = 0;
    text = text.replace(CITY_STATE, (_m, st) => {
      mark(2);
      return `[city] ${st}`;
    });
  }
  run(DOCTOR, "[name]", 1);
  run(NAME_INTRO, "[name]", 1);
  run(BIO, "[bio]", 16);
  run(PHOTO, "[photo]", 17);
  run(AGE_90, "[age90+]", 3);
  run(SSN_PHRASE, "[ssn]", 7);
  run(LONG_ID, "[id]", 18);

  EMAIL.lastIndex = 0;
  PHONE.lastIndex = 0;
  SSN.lastIndex = 0;
  const leftover =
    EMAIL.test(text) ||
    PHONE.test(text) ||
    SSN.test(text) ||
    /\b\d{3}-\d{2}-\d{4}\b/.test(text);

  if (leftover) return { text: "", dropped: true, hits };
  if (!text.trim()) return { text: "", dropped: true, hits };
  if (text.length > 600) text = text.slice(0, 600);
  return { text, dropped: false, hits };
}

export function safeHarborText(value) {
  return safeHarborRedact(value).text;
}
