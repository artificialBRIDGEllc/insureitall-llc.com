import { createMiddleware } from "@tanstack/react-start";
import { isStaffEmail } from "@/lib/staff";

export class ForbiddenError extends Error {
  readonly status = 403;
  constructor() {
    super("Forbidden");
    this.name = "ForbiddenError";
  }
}

/** Auth + INSUREitALL team email. Outside agents/agencies are rejected. */
export const staffMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { getBearerToken } = await import("@/lib/auth/client");
    return next({ sendContext: { bearerToken: getBearerToken() ?? undefined } });
  })
  .server(async ({ next, context }) => {
    const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
    const { DEV_USER_ID, getSessionUser, requireUserId } = await import(
      "@/lib/auth/verify.server"
    );
    assertSameSiteRequest();
    const userId = await requireUserId(context.bearerToken);
    const session = await getSessionUser(context.bearerToken);
    const email = session?.email ?? null;
    if (userId !== DEV_USER_ID && !isStaffEmail(email)) {
      throw new ForbiddenError();
    }
    return next({ context: { userId, email, staff: true as const } });
  });
