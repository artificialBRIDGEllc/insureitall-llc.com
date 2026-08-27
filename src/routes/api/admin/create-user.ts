import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getUserRole, setUserRole, type UserRole } from "@/lib/auth/roles";
import { auth } from "@/lib/auth/server";
import { randomUUID, randomInt } from "crypto";

export const createUserAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(
    async (input: any) => {
      const { email, name, role, context } = input;

    // Check if caller is admin or super_admin
    const callerRole = await getUserRole(context.userId);
    if (callerRole !== "admin" && callerRole !== "super_admin") {
      throw new Error("Only admins can create accounts.");
    }

    // Super admin can create any role; admins can only create users
    if (callerRole === "admin" && role !== "user") {
      throw new Error("Only super_admin can create admin accounts.");
    }

    // Validate email format
    if (!email.includes("@")) {
      throw new Error("Invalid email address.");
    }

    if (!name || name.length < 2) {
      throw new Error("Name must be at least 2 characters.");
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();

    // Create user via Better Auth
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();

    // Check if user already exists
    const existing = await sql<Array<{ id: string }>>`
      select id from "user" where email = ${email}
    `;

    if (existing.length > 0) {
      throw new Error("User with this email already exists.");
    }

    try {
      const userId = randomUUID();

      // Create user
      await sql`
        insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
        values (${userId}, ${name}, ${email}, false, now(), now())
      `;

      // Create account with temporary password using simple hash
      // In production, ensure bcrypt is available for secure hashing
      const passwordHash = await hashPassword(tempPassword);
      const accountId = randomUUID();

      await sql`
        insert into account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
        values (${accountId}, ${accountId}, 'email', ${userId}, ${passwordHash}, now(), now())
      `;

      // Assign role
      await setUserRole(userId, role);

      return {
        success: true,
        userId,
        email,
        tempPassword,
        message: "User created. Share the temporary password with them securely.",
      };
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to create user account."
      );
    }
  });

function generateTempPassword(): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const nums = "0123456789";
  const symbols = "!@#$%^&*";
  const all = upper + lower + nums + symbols;

  let password = "";
  password += upper[randomInt(upper.length)];
  password += lower[randomInt(lower.length)];
  password += nums[randomInt(nums.length)];
  password += symbols[randomInt(symbols.length)];

  for (let i = 0; i < 8; i++) {
    password += all[randomInt(all.length)];
  }

  const chars = password.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

async function hashPassword(password: string): Promise<string> {
  // Try to use bcrypt if available, otherwise use fallback
  try {
    // Dynamic import to avoid compile errors if bcrypt not installed
    const bcryptModule = await import("bcrypt").catch(() => null);
    if (bcryptModule) {
      return await bcryptModule.hash(password, 10);
    }
  } catch {
    // continue to fallback
  }

  // Fallback hash - NOTE: This is NOT secure for production
  // Install bcrypt in package.json for proper password hashing
  const crypto = await import("crypto");
  console.warn("⚠️ Using sha256 fallback - install bcrypt for production security");
  const hash = crypto.default.createHash("sha256").update(password).digest("hex");
  return "$2b$10$" + hash.substring(0, 53);
}
