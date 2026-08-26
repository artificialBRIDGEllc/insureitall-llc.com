import { AB_LEGAL, AB_NAME, AB_ORIGIN, AB_PRODUCT, FILEBRIDGE_PUBLIC } from "@/lib/ab";

export const AB_EMAIL = "lang@theartificialbridge.com";
export const AB_FORMATION = "Wyoming single-member limited liability company";
export const AB_EFFECTIVE = "25 August 2026";

export const AB_ENTITY = {
  legalName: AB_LEGAL,
  brand: AB_NAME,
  formation: AB_FORMATION,
  managed: "member-managed — one member, no other owners, no parent, no outside investors",
  not: [
    "not a licensed insurance agency",
    "not a Medicare plan",
    "not CMS or HHS",
    "not INSUREitALL LLC",
    "does not sell insurance",
  ],
  product: AB_PRODUCT,
  productUrl: FILEBRIDGE_PUBLIC,
  origin: AB_ORIGIN,
  email: AB_EMAIL,
  playbook: `${AB_ORIGIN}/brand`,
} as const;

export const AB_SUBPROCESSORS = [
  { name: "Vercel Inc.", role: "application hosting and CDN" },
  { name: "Neon Inc.", role: "hosted Postgres for accounts and files" },
  { name: "Google LLC / X Corp.", role: "optional sign-in, only if you choose that button" },
] as const;
