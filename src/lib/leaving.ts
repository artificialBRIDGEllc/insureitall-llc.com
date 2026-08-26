import { AB_LEGAL, AB_PRODUCT, FILEBRIDGE_PUBLIC } from "@/lib/ab";
import { SITE_LEGAL, SITE_NAME } from "@/lib/seo";

export type LeaveDest = "filebridge";

export const LEAVE_DEST: Record<
  LeaveDest,
  {
    product: string;
    operator: string;
    publicUrl: string;
    continuePath: string;
    privacyUrl: string;
    termsUrl: string;
  }
> = {
  filebridge: {
    product: AB_PRODUCT,
    operator: AB_LEGAL,
    publicUrl: FILEBRIDGE_PUBLIC,
    continuePath: "/portal",
    privacyUrl: "/ab/privacy",
    termsUrl: "/ab/terms",
  },
};

export function leavePath(dest: LeaveDest = "filebridge") {
  return `/leaving?to=${dest}`;
}

export const LEAVE_POINTS = [
  `${SITE_NAME} is a licensed Medicare insurance agency. You are leaving ${SITE_LEGAL}.`,
  `${AB_PRODUCT} is owned and operated by ${AB_LEGAL}. It is a third-party site — not ${SITE_NAME}, not Medicare, and not CMS.`,
  "That site has its own privacy policy and terms. What you type there is collected by artificialBRIDGE, not by this agency, until you grant this agency access.",
  "Granting INSUREitALL access is optional, field-by-field, and revocable. It is not an enrollment and not an offer of insurance.",
  "TCPA consent you gave on this site does not move with you. Call-recording rules on this site do not apply to that site.",
  "You can come back here at any time.",
];
