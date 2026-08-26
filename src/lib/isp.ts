import { SITE_EMAIL, SITE_LEGAL, SITE_NPN } from "@/lib/seo";
import { HQ_ONE_LINE, PHONE_DISPLAY } from "@/lib/utils";

export const ISP_REVIEWED = "August 25, 2026";
export const ISP_PATH = "/security";

export const ISP_ORG = {
  entity: SITE_LEGAL,
  npn: SITE_NPN,
  coordinator: "Privacy Official",
  email: SITE_EMAIL,
  phone: PHONE_DISPLAY,
  address: HQ_ONE_LINE,
  reviewed: ISP_REVIEWED,
};

export const ISP_HOLDS = [
  "Callback requests: name, phone, email, zip, window, notes",
  "Needs analysis / portal file: optional doctor names, medication names, budget",
  "Account sign-in for the consumer portal and the staff desk",
  "Call recordings (disclosed on the line)",
];

export const ISP_SAFEGUARDS = [
  {
    t: "Access",
    d: "Staff desk is team-email only. A consumer sees only their own portal file. Share codes are revocable and open only inside ops.",
  },
  {
    t: "Identifiers",
    d: "No Social Security or Medicare-number fields. Free text that looks like either is rejected.",
  },
  {
    t: "Transit",
    d: "Production is HTTPS. Scripted cross-site requests are blocked. Security headers include nosniff.",
  },
  {
    t: "Minimum necessary",
    d: "Team lead alerts carry name, phone, email, zip, and window only. Doctors and medications stay on the desk.",
  },
  {
    t: "AI wall",
    d: "Live BRIDGEt chat cannot open the needs file. Training or site improvement uses a service-provider contract, de-identified data, or authorization.",
  },
];

export const ISP_VENDORS = [
  {
    t: "Hosting and database",
    d: "The public site and data store. PHI stays in the agency database, not in marketing tools.",
  },
  {
    t: "Communications",
    d: "Phone, email, and optional lead-alert webhooks. Alerts are minimum-necessary.",
  },
  {
    t: "AI processing",
    d: "BRIDGEt voice/chat vendors, if enabled, process a live turn. They do not receive the needs file unless a BAA and a service-provider contract are in place.",
  },
];

export const ISP_INCIDENT = [
  "Tell the Privacy Official the same day — info@team-iia.com or the phone on this site.",
  "Contain: rotate credentials, lock the desk if needed, preserve logs.",
  "HIPAA: notify affected people and HHS without unreasonable delay, no later than 60 days after discovery if unsecured PHI is breached.",
  "Florida FIPA: notify as required when name is combined with medical or health-insurance data.",
  "States that adopted NAIC 668: notify the department of insurance as that statute requires (often 72 hours after a cybersecurity event).",
];

export const BAA_POLICY = [
  "We execute a Business Associate Agreement before a vendor creates, receives, maintains, or transmits PHI for us.",
  "A BAA is a contract, not a badge. We do not list a vendor as signed until the paper is executed.",
  "Workforce (INSUREitALL team emails) is not a business associate.",
  "Carriers receive PHI only when you ask us to enroll or service — that is plan administration, not a website dump.",
  "Request or send a BAA: info@team-iia.com.",
];
