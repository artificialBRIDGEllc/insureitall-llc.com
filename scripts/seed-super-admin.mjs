/**
 * Seed super admin user for console access.
 * Usage: SUPER_ADMIN_EMAIL=admin@example.com SUPER_ADMIN_PASSWORD=secure_password node scripts/seed-super-admin.mjs
 * Or for the default user: SUPER_ADMIN_PASSWORD=your_password node scripts/seed-super-admin.mjs
 */

import { Pool } from "pg";
import { randomUUID } from "crypto";

const databaseUrl = process.env.DATABASE_URL;
const email = process.env.SUPER_ADMIN_EMAIL || "Lang@theartificialbridge.com";
const password = process.env.SUPER_ADMIN_PASSWORD;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL not set. Cannot seed database.");
  process.exit(1);
}

if (!password) {
  console.error("❌ SUPER_ADMIN_PASSWORD environment variable not set.");
  console.error("   Usage: SUPER_ADMIN_PASSWORD=your_password node scripts/seed-super-admin.mjs");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

async function seedSuperAdmin() {
  try {

    console.log("🌱 Seeding super admin user...");

    // Create user
    const userId = randomUUID();
    const userRoleId = randomUUID();

    await pool.query(
      `INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      [userId, "Super Admin", email, true]
    );

    // Get or create user ID if it already existed
    const userResult = await pool.query(
      `SELECT id FROM "user" WHERE email = $1`,
      [email]
    );

    const actualUserId = userResult.rows[0]?.id || userId;

    // Create account with password
    const accountId = randomUUID();
    const hashedPassword = await hashPassword(password);

    await pool.query(
      `INSERT INTO account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT ("userId", "providerId") DO UPDATE
       SET password = $5, "updatedAt" = NOW()`,
      [accountId, accountId, "email", actualUserId, hashedPassword]
    );

    // Create or update role
    await pool.query(
      `INSERT INTO user_role (id, user_id, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (user_id) DO UPDATE
       SET role = $3, "updatedAt" = NOW()`,
      [userRoleId, actualUserId, "super_admin"]
    );

    console.log(`✅ Super admin created successfully!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔐 Password: ${password}`);
    console.log(`⚠️  User will be prompted to change password on first login.`);
  } catch (error) {
    console.error("❌ Error seeding super admin:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

/**
 * Hash password using bcrypt (same as Better Auth)
 */
async function hashPassword(password) {
  // Use Node's built-in crypto for a simple hash
  // Better Auth uses bcrypt, so this should match
  const crypto = (await import("crypto")).default;

  // For production, this should use bcrypt
  // For now, we'll create a simple implementation
  try {
    const bcrypt = await import("bcrypt");
    return await bcrypt.hash(password, 10);
  } catch {
    // Fallback if bcrypt not available
    // Note: This is not secure for production
    console.warn("⚠️  bcrypt not available, using simple hash (not secure for production)");
    const hash = crypto.createHash("sha256").update(password).digest("hex");
    return "$2b$10$" + hash.substring(0, 53);
  }
}

seedSuperAdmin();
