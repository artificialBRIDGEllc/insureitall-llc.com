import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getUserRole, setUserRole, type UserRole } from "@/lib/auth/roles";
import { auth } from "@/lib/auth/server";
import { randomUUID, randomInt } from "crypto";

interface CreateUserInput {
  email: string;
  name: string;
  role: UserRole;
}

export const createUserAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: CreateUserInput) => input)
  .handler(async ({ data, context }) => {
    const { email, name, role } = data;

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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

      // Better Auth stores email/password credentials under providerId
      // 'credential' and verifies them with its own (scrypt) hasher — the
      // hash MUST come from auth.$context.password or sign-in fails.
      const authCtx = await auth.$context;
      const passwordHash = await authCtx.password.hash(tempPassword);
      const accountId = randomUUID();

      await sql`
        insert into account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
        values (${accountId}, ${accountId}, 'credential', ${userId}, ${passwordHash}, now(), now())
      `;

      // Assign role
      await setUserRole(userId, role);

      // Send password via email
      await sendPasswordEmail(email, name, tempPassword).catch((err) => {
        console.error("Failed to send password email:", err);
      });

      return {
        success: true,
        userId,
        email,
        message: "User created successfully. A temporary password has been sent to their email.",
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

async function sendPasswordEmail(
  email: string,
  name: string,
  password: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured - password email not sent");
    return;
  }

  try {
    const consoleUrl =
      process.env.VERCEL_URL?.startsWith("http")
        ? process.env.VERCEL_URL
        : `https://${process.env.VERCEL_URL || "insureitall-llc.com"}`;

    const payload = {
      from: "INSUREitALL Team <noreply@insureitall-llc.com>",
      to: email,
      subject: "Your INSUREitALL Console Account",
      html: buildPasswordEmail(name, password, consoleUrl),
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Email send failed: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Password email send failed:", error);
  }
}

function buildPasswordEmail(
  name: string,
  password: string,
  consoleUrl: string
): string {
  const encodedPassword = password.replace(/[&<>"]/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
    };
    return map[char] || char;
  });

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<p>Hi ${name},</p>
<p>Your INSUREitALL team console account has been created.</p>
<p><strong>Temporary Password:</strong></p>
<code style="font-family: monospace; background: #f5f5f5; padding: 10px; display: block; word-break: break-all;">${encodedPassword}</code>
<p>Please log in at <a href="${consoleUrl}/console">Your Console</a> and change your password on first login.</p>
<p>Best regards,<br>INSUREitALL Team</p>
</body>
</html>`;
}
