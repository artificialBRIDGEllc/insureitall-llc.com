import { SITE_EMAIL, SITE_LEGAL, SITE_NPN } from "@/lib/seo";
import { HQ_ONE_LINE, PHONE_DISPLAY } from "@/lib/utils";

export const GLBA_REVIEWED = "August 25, 2026";
export const GLBA_PATH = "/glba";

export const GLBA_ORG = {
  entity: SITE_LEGAL,
  npn: SITE_NPN,
  email: SITE_EMAIL,
  phone: PHONE_DISPLAY,
  address: HQ_ONE_LINE,
  reviewed: GLBA_REVIEWED,
};

export const GLBA_COLLECT = [
  "Identity and contact: name, phone, email, zip, and a callback window",
  "Coverage file you choose to save: doctors, medication names, budget comfort, notes",
  "Account data if you open a portal: email, sign-in method, share codes you create",
  "Call recordings when you speak with us (disclosed on the line)",
  "Site use that does not identify you personally (pages viewed, device type)",
];

export const GLBA_SHARE_ROWS = [
  {
    reason: "For our everyday business purposes — to take your request, prepare a licensed agent, service coverage, meet CMS or state rules, or respond to a lawful request",
    share: "Yes",
    limit: "No",
  },
  {
    reason: "For our marketing purposes — to offer INSUREitALL Medicare services to you (calls and texts still need your TCPA consent)",
    share: "Yes",
    limit: "No — this is our own services, not a sale",
  },
  {
    reason: "For joint marketing with other financial companies",
    share: "No",
    limit: "We don’t share",
  },
  {
    reason: "For affiliates’ everyday business purposes (transactions and experiences)",
    share: "No",
    limit: "We don’t have affiliates that receive this",
  },
  {
    reason: "For affiliates to market to you",
    share: "No",
    limit: "We don’t share",
  },
  {
    reason: "For nonaffiliates to market to you — including other TPMOs or lead buyers",
    share: "No",
    limit: "We don’t sell or pass leads",
  },
];

export const GLBA_WHO = [
  {
    t: "INSUREitALL team",
    d: "Licensed agents and staff on team-iia.com, insureitallins.com, insureitall-llc.com, or insureitall.com, so they can call you back.",
  },
  {
    t: "Carriers",
    d: "Only when you ask us to enroll, service, or work a plan issue — not because you typed a form.",
  },
  {
    t: "Service providers",
    d: "Hosting, phone, email, and AI vendors who process or help train BRIDGEt under contracts that limit their use. They may not use it to market their own products.",
  },
  {
    t: "As required",
    d: "CMS, a state department of insurance, a court, or another lawful demand.",
  },
];

/** NAIC Model 672 — health information is stricter than financial NPI. */
export const GLBA_HEALTH_IS = [
  "Doctor names you type so an agent can prepare",
  "Medication names you type",
  "Notes you write about care, conditions, or coverage",
];

export const GLBA_HEALTH_FUNCTIONS = [
  "Prepare a licensed INSUREitALL agent to talk with you",
  "Discuss plan types we actually offer in your area",
  "Service coverage after you ask us to enroll or help",
  "Meet CMS, carrier, and state insurance rules",
];

export const GLBA_ACCESS = [
  {
    t: "See it",
    d: "Email or call and we will send a copy of the recorded personal information we hold on you.",
  },
  {
    t: "Correct it",
    d: "Tell us what is wrong. Within 30 business days we will correct it, or tell you why we will not and how to file a statement.",
  },
  {
    t: "Delete it",
    d: "Ask us to delete a portal file or lead request. We will, unless CMS, a carrier, or law requires a retention copy.",
  },
];
