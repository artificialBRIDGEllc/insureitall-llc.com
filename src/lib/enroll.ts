/**
 * Online self-enrollment via the agency's Sunfire personalized URL (PURL).
 *
 * `VITE_SUNFIRE_PURL` — the agent PURL issued by Sunfire. Enrollments started
 * from it are attributed to that writing agent, so the URL is used exactly as
 * issued: no UTM or other query params are appended (extra params can break
 * Sunfire's agent attribution).
 *
 * Unset or not an https URL → `null`, and every "Enroll online" surface hides
 * itself and falls back to the phone CTA. Nothing breaks if the env var is
 * missing.
 */

const raw = (import.meta.env as Record<string, string | undefined>).VITE_SUNFIRE_PURL?.trim();

function parsePurl(value: string | undefined): string | null {
  // Require an absolute https:// URL: "https:host/path" parses as https but
  // as an href resolves against this site's origin, not Sunfire.
  if (!value || /\s/.test(value) || !/^https:\/\//i.test(value)) return null;
  try {
    // Parse only to validate. Return the issued string untouched: the URL
    // serializer can rewrite it (trailing slash, casing, ports) and break
    // Sunfire's agent attribution.
    return new URL(value).protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

/** The configured Sunfire PURL, or `null` when self-enrollment is off. */
export const ENROLL_URL: string | null = parsePurl(raw);

export const enrollEnabled = ENROLL_URL !== null;
