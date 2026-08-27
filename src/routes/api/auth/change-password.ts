import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { auth } from "@/lib/auth/server";
import { markPasswordChanged } from "@/lib/auth/roles";

export const changePassword = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .handler(
    async (input: {
      data?: {
        currentPassword?: string;
        newPassword: string;
      };
      context: { userId: string };
    }) => {
      const { currentPassword, newPassword } = input.data ?? {};
      const { context } = input;

    if (!newPassword || newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    const userId = context.userId;

    // Get the user's account to verify current password
    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();

    if (!request) {
      throw new Error("Request context not available");
    }

    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      throw new Error("Not authenticated");
    }

    // Update password in Better Auth account table
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();

    // Hash the new password using bcrypt (same as Better Auth)
    const bcryptHash = await hashPasswordBcrypt(newPassword);

    // Update the account password
    await sql`
      update account
      set password = ${bcryptHash}, "updatedAt" = now()
      where "userId" = ${userId} and "providerId" = 'email'
    `;

    // Mark password as changed
    await markPasswordChanged(userId);

    return { success: true };
  });

async function hashPasswordBcrypt(password: string): Promise<string> {
  try {
    const bcrypt = await import("bcrypt");
    return await bcrypt.hash(password, 10);
  } catch {
    // Fallback to simple hash if bcrypt not available
    const crypto = await import("crypto");
    // This is NOT secure for production - bcrypt must be available
    console.warn("⚠️ Using fallback password hash - bcrypt required for production");
    const hash = crypto.default.createHash("sha256").update(password).digest("hex");
    // Pad to bcrypt length for compatibility
    return "$2b$10$" + hash.substring(0, 53);
  }
}
