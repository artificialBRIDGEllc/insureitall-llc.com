/** artificialBRIDGE brand — playbook: https://theartificialbridge.com/brand */

export const AB_NAME = "artificialBRIDGE";
export const AB_TAGLINE = "end to end";
export const AB_PRODUCT = "fileBRIDGE";
export const AB_ORIGIN = "https://theartificialbridge.com";
export const AB_PORTAL_ORIGIN = "https://filebridge.theartificialbridge.com";
export const AB_BRAND_URL = "https://theartificialbridge.com/brand";
export const AB_LEGAL = "artificialBRIDGE LLC";

export const AB_HOSTS = [
  "theartificialbridge.com",
  "www.theartificialbridge.com",
  "filebridge.theartificialbridge.com",
];

export function isAbPortalHost(hostname = ""): boolean {
  const host = hostname || (typeof window !== "undefined" ? window.location.hostname : "");
  return AB_HOSTS.some((h) => host === h || host.endsWith(`.${h}`)) || host.startsWith("filebridge.");
}

/** IIA site links here. Same-origin /portal in this preview. */
export function fileBridgeHref(path = "/portal"): string {
  const clean = path.startsWith("/portal") ? path : `/portal${path}`;
  if (typeof window !== "undefined" && isAbPortalHost()) return clean;
  return clean;
}

export const FILEBRIDGE_PUBLIC = "https://filebridge.theartificialbridge.com";
