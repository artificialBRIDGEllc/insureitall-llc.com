/** INSUREitALL team identity — not outside agents or agencies. */

export const STAFF_DOMAINS = [
  "team-iia.com",
  "insureitallins.com",
  "insureitall-llc.com",
  "insureitall.com",
] as const;

export function isStaffEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  return (STAFF_DOMAINS as readonly string[]).includes(domain);
}

export function isStaffUser(user: {
  primaryEmail: string | null;
  isDevFallback?: boolean;
} | null): boolean {
  if (!user) return false;
  if (user.isDevFallback) return true;
  return isStaffEmail(user.primaryEmail);
}
