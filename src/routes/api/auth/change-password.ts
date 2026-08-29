import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { authMiddleware } from "@/lib/auth/middleware";
import { auth } from "@/lib/auth/server";
import { getUserWithRole, markPasswordChanged } from "@/lib/auth/roles";

interface ChangePasswordInput {
  currentPassword?: string;
  newPassword: string;
}

export const changePassword = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: ChangePasswordInput) => input)
  .handler(async ({ data, context }) => {
    const { currentPassword, newPassword } = data;

    if (!newPassword || newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    const userId = context.userId;

    const request = getRequest();
    if (!request) {
      throw new Error("Request context not available");
    }

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user || session.user.id !== userId) {
      throw new Error("Not authenticated");
    }

    const { getSql } = await import("@/lib/db");
    const sql = await getSql();

    // Better Auth stores email/password credentials under providerId
    // 'credential' and verifies them with its own (scrypt) hasher — the hash
    // MUST come from auth.$context.password or future sign-ins fail.
    const authCtx = await auth.$context;

    const accounts = await sql<Array<{ id: string; password: string | null }>>`
      select id, password from account
      where "userId" = ${userId} and "providerId" = 'credential'
    `;
    const account = Array.isArray(accounts) ? accounts[0] : (accounts as any)?.[0];
    if (!account?.password) {
      throw new Error("No password account found for this user.");
    }

    // A user who has already changed their temporary password must prove the
    // current one; only the forced first-login change may skip it.
    const userRecord = await getUserWithRole(userId);
    const forcedFirstChange = !userRecord?.passwordChangedAt;
    if (!forcedFirstChange) {
      if (!currentPassword) {
        throw new Error("Current password is required.");
      }
      const valid = await authCtx.password.verify({
        hash: account.password,
        password: currentPassword,
      });
      if (!valid) {
        throw new Error("Current password is incorrect.");
      }
    }

    const newHash = await authCtx.password.hash(newPassword);

    await sql`
      update account
      set password = ${newHash}, "updatedAt" = now()
      where id = ${account.id}
    `;

    await markPasswordChanged(userId);

    return { success: true };
  });
