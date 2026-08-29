/**
 * Static-import replacement for `tanstackStartCookies` from
 * "better-auth/tanstack-start".
 *
 * The upstream plugin loads `@tanstack/react-start/server` with a dynamic
 * `await import(...)` inside its after-hook. Under the production SSR build
 * (rolldown + nitro) that dynamic import makes the bundler emit an
 * `ssr_exports` namespace re-export in the generated `ssr.mjs` facade chunk
 * without ever defining it, so the server crashes at module load with
 * `SyntaxError: Export 'ssr_exports' is not defined in module` and every
 * request returns the unhandled 500. Importing `setCookie` statically keeps
 * the chunk graph sound. Behavior is otherwise identical to upstream.
 */
import { setCookie } from "@tanstack/react-start/server";
import { createAuthMiddleware } from "better-auth/api";
import { parseSetCookieHeader, toCookieOptions } from "better-auth/cookies";
import type { BetterAuthPlugin } from "better-auth";

export const tanstackStartCookies = (): BetterAuthPlugin => ({
  id: "tanstack-start-cookies",
  hooks: {
    after: [
      {
        matcher() {
          return true;
        },
        handler: createAuthMiddleware(async (ctx) => {
          const returned = ctx.context.responseHeaders;
          if ("_flag" in ctx && ctx._flag === "router") return;
          if (returned instanceof Headers) {
            const setCookies = returned.get("set-cookie");
            if (!setCookies) return;
            const parsed = parseSetCookieHeader(setCookies);
            parsed.forEach((value, key) => {
              if (!key) return;
              try {
                setCookie(key, value.value, toCookieOptions(value));
              } catch {
                // Outside a request context (e.g. direct API invocation) —
                // nothing to set the cookie on; same swallow as upstream.
              }
            });
          }
        }),
      },
    ],
  },
});
