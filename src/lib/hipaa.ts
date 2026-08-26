import { SITE_EMAIL, SITE_LEGAL, SITE_NPN } from "@/lib/seo";
import { HQ_ONE_LINE, PHONE_DISPLAY } from "@/lib/utils";

export const HIPAA_REVIEWED = "August 25, 2026";
export const PRIVACY_OFFICIAL = SITE_EMAIL;
export const HIPAA_PATH = "/hipaa";

export type HipaaControl = {
  id: string;
  title: string;
  where: string;
  proof: string;
  cfr: string;
};

/** Product controls we can show a carrier — not a certificate. */
export const HIPAA_CONTROLS: HipaaControl[] = [
  {
    id: "no-mbi",
    title: "No Medicare number or SSN fields",
    where: "Public forms, portal file, BRIDGEt widget",
    proof: "Those inputs do not exist. Free-text is scanned and rejected if it looks like an SSN or Medicare Beneficiary Identifier.",
    cfr: "45 CFR 164.502(b) · minimum necessary",
  },
  {
    id: "walled-ai",
    title: "BRIDGEt cannot see the needs file",
    where: "Widget + /bridget",
    proof: "Live chat does not open your portal or needs file. Doctor and medication names you type into a form stay with INSUREitALL. If anything is later used to train BRIDGEt or improve the product, it is only de-identified or aggregated under the design-partner license — never SSN or Medicare numbers.",
    cfr: "45 CFR 164.514 · de-identification / minimum necessary",
  },
  {
    id: "safe-harbor",
    title: "Safe Harbor strip before training",
    where: "BRIDGEt voice transcript",
    proof: "Individual-level text is stored only after the 18 identifiers in 45 CFR 164.514(b)(2) are removed. Audio is never stored (voiceprints are identifiers). 5-digit ZIP is reduced to 3 digits, or dropped if the area is under 20,000 people. Ages 90+ are grouped. No re-identification key is kept.",
    cfr: "45 CFR 164.514(b)(2) · Safe Harbor",
  },
  {
    id: "staff-gate",
    title: "Staff desk is team-email only",
    where: "/console",
    proof: "Only signed-in users on team-iia.com, insureitallins.com, insureitall-llc.com, or insureitall.com. Outside agents cannot open the lead desk.",
    cfr: "45 CFR 164.312(a) · access control",
  },
  {
    id: "portal-scope",
    title: "A consumer sees only their own file",
    where: "/portal",
    proof: "Portal reads and writes are keyed to the signed-in account. Share codes are revocable and open only inside the INSUREitALL ops workspace.",
    cfr: "45 CFR 164.312(a) · unique user identification",
  },
  {
    id: "same-site",
    title: "Cross-site session riding is blocked",
    where: "Server functions",
    proof: "Scripted cross-site requests are rejected. Session cookies are not usable from a sibling site.",
    cfr: "45 CFR 164.312(e) · transmission security",
  },
  {
    id: "tls",
    title: "Encryption in transit",
    where: "Production HTTPS",
    proof: "The live site is served over TLS. Security headers include nosniff and a strict referrer policy. We do not frame-lock the page (preview and partner embeds).",
    cfr: "45 CFR 164.312(e) · encryption",
  },
  {
    id: "consent",
    title: "TCPA consent is enforced on the server",
    where: "/lead · /needs-analysis",
    proof: "A checkbox is not enough. The server refuses the lead unless consent is true. Honeypots are dropped. Submits are rate-limited.",
    cfr: "Administrative · intake integrity",
  },
  {
    id: "no-sale",
    title: "We do not sell PHI",
    where: "Privacy Policy",
    proof: "Optional doctor and medication names are used so a licensed agent can prepare. They are not sold. They are not emailed in lead alerts. Training or product improvement uses de-identified or aggregated data only. See the GLBA notice.",
    cfr: "45 CFR 164.502 · uses and disclosures",
  },
];

export const HIPAA_NEVER = [
  "Social Security numbers",
  "Medicare numbers (the number on the red, white, and blue card)",
  "Bank accounts or payment cards",
  "Uploaded medical records, lab PDFs, or images of insurance cards",
];

export const HIPAA_MAY = [
  "Name, phone, email, zip, and a callback window",
  "Doctors you want to keep — if you type them",
  "Medication names — if you type them",
  "Budget comfort and notes you choose to share",
];

export const HIPAA_RIGHTS = [
  {
    t: "See it",
    d: "Ask for a copy of the file we hold on you (portal record or lead request).",
  },
  {
    t: "Fix it",
    d: "Tell us what is wrong. We will correct it or note the dispute.",
  },
  {
    t: "Delete it",
    d: "Email or call and we will delete the portal account and lead file we control, unless a carrier or law requires a retention copy.",
  },
  {
    t: "Limit it",
    d: "You may send a needs analysis with zip and phone only. Doctor and medication fields are optional.",
  },
];

export const HIPAA_SAFE_HARBOR = [
  "Names",
  "Places smaller than a state (street, city, county, 5-digit ZIP)",
  "Dates except year, and ages 90+",
  "Phone numbers",
  "Fax numbers",
  "Email addresses",
  "Social Security numbers",
  "Medical record numbers",
  "Health plan / Medicare Beneficiary Identifiers",
  "Account numbers",
  "Certificate and license numbers",
  "Vehicle identifiers and plates",
  "Device identifiers and serial numbers",
  "Web URLs",
  "IP addresses",
  "Biometrics, including voiceprints — we do not keep audio",
  "Full-face photographs",
  "Any other unique identifying number or code — no re-identification key",
] as const;

export const HIPAA_ORG = {
  entity: SITE_LEGAL,
  npn: SITE_NPN,
  official: "Privacy Official",
  email: PRIVACY_OFFICIAL,
  phone: PHONE_DISPLAY,
  address: HQ_ONE_LINE,
  reviewed: HIPAA_REVIEWED,
};
