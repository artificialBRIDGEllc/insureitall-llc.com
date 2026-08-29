/**
 * Seed super admin user for console access.
 * Usage: SUPER_ADMIN_EMAIL=admin@example.com SUPER_ADMIN_PASSWORD=secure_password node scripts/seed-super-admin.mjs
 * Or for the default user: SUPER_ADMIN_PASSWORD=your_password node scripts/seed-super-admin.mjs
 */

import { Pool } from "pg";
import { randomUUID } from "crypto";
import { hashPassword } from "better-auth/crypto";

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

    // Create (or refresh) the credential account. No unique constraint exists
    // on ("userId", "providerId"), so upsert manually instead of ON CONFLICT.
    const hashedPassword = await hashPassword(password);
    const existingAccount = await pool.query(
      `SELECT id FROM account WHERE "userId" = $1 AND "providerId" = 'credential'`,
      [actualUserId]
    );

    if (existingAccount.rows[0]) {
      await pool.query(
        `UPDATE account SET password = $2, "updatedAt" = NOW() WHERE id = $1`,
        [existingAccount.rows[0].id, hashedPassword]
      );
    } else {
      const accountId = randomUUID();
      await pool.query(
        `INSERT INTO account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
         VALUES ($1, $2, 'credential', $3, $4, NOW(), NOW())`,
        [accountId, accountId, actualUserId, hashedPassword]
      );
    }

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

seedSuperAdmin();
