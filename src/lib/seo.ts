import { TPMO_DISCLAIMER } from "@/lib/compliance";
import { HQ_LINE1, HQ_LINE2, PHONE_DISPLAY } from "@/lib/utils";

export const SITE_ORIGIN = "https://insureitall-llc.com";
export const SITE_NAME = "INSUREitALL";
export const SITE_LEGAL = "INSUREitALL LLC";
export const SITE_NPN = "20114179";
export const SITE_EMAIL = "info@team-iia.com";

export const PUBLIC_PATHS = [
  "/",
  "/bridget",
  "/compare",
  "/contact",
  "/medicare-basics",
  "/needs-analysis",
  "/privacy",
  "/hipaa",
  "/glba",
  "/security",
  "/terms",
  "/ai-disclosure",
  "/ab",
  "/ab/privacy",
  "/ab/terms",
  "/accessibility",
] as const;

export function canonical(path: string) {
  const clean = path === "/" ? "/" : path.replace(/\/+$/, "");
  return `${SITE_ORIGIN}${clean}`;
}

export function pageHead({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}) {
  const full = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      {
        name: "robots",
        content: index ? "index, follow, max-image-preview:large" : "noindex, nofollow",
      },
    ],
    links: [{ rel: "canonical", href: canonical(path) }],
  };
}

export const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: SITE_LEGAL,
  alternateName: SITE_NAME,
  url: SITE_ORIGIN,
  telephone: "+1-908-827-6223",
  email: SITE_EMAIL,
  naics: "524210",
  identifier: { "@type": "PropertyValue", name: "NPN", value: SITE_NPN },
  address: {
    "@type": "PostalAddress",
    streetAddress: `${HQ_LINE1}, ${HQ_LINE2}`,
    addressLocality: "Tampa",
    addressRegion: "FL",
    postalCode: "33618",
    addressCountry: "US",
  },
  areaServed: "US",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  description:
    "Licensed Medicare insurance agency. Needs analysis, plan-type education, and licensed agents. Not connected with or endorsed by the U.S. Government or the federal Medicare program.",
};

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Homepage FAQ — keep in sync with the questions rendered on `/`. */
export const HOME_FAQS = [
  {
    q: "Does it cost anything to talk to an agent?",
    a: "No. There is no cost to speak with a licensed INSUREitALL agent. Our compensation comes from carriers when you enroll — never from you.",
  },
  {
    q: "Will I be pressured to enroll?",
    a: "No. We start by listening. Agents do not work from sales scripts or quotas that push one plan. You enroll only when you are ready.",
  },
  {
    q: "Which carriers and plans do you offer?",
    a: `We compare multiple carriers. ${TPMO_DISCLAIMER}`,
  },
  {
    q: "What happens after I enroll?",
    a: "A retention team stays with you for claims questions, benefit changes, and annual reviews. You are not handed off to a call center void.",
  },
  {
    q: "What should I have ready when I call?",
    a: `Your doctors, current medications, and a sense of your budget. If you need someone now, call ${PHONE_DISPLAY}. We will never rush you.`,
  },
];
