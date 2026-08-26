/**
 * Commercial response headers. Do not set X-Frame-Options or a tight
 * frame-ancestors CSP — the live preview is framed. Vercel adds HSTS.
 */
const HEADERS: Record<string, string> = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-dns-prefetch-control": "off",
  "permissions-policy": "camera=(), geolocation=(), payment=(), usb=()",
};

interface NitroEvent {
  url: URL;
}

export default async function securityHeadersMiddleware(
  _event: NitroEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const result = await next();
  if (!(result instanceof Response)) return result;
  const headers = new Headers(result.headers);
  for (const [key, value] of Object.entries(HEADERS)) {
    if (!headers.has(key)) headers.set(key, value);
  }
  return new Response(result.body, {
    status: result.status,
    statusText: result.statusText,
    headers,
  });
}
