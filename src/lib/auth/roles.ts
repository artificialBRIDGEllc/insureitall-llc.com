import { getSql } from "@/lib/db";

export type UserRole = "super_admin" | "admin" | "user";

export interface UserWithRole {
  id: string;
  email: string | null;
  displayName?: string;
  role: UserRole;
  passwordChangedAt: string | null;
}

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const sql = await getSql();
  const result = await sql<Array<{ role: UserRole }>>`
    select role from user_role where user_id = ${userId}
  `;
  const row = Array.isArray(result) ? result[0] : (result as any)?.[0];
  return row?.role ?? null;
}

export async function getUserWithRole(userId: string): Promise<UserWithRole | null> {
  const sql = await getSql();
  const result = await sql<Array<{
    id: string;
    email: string | null;
    displayName: string | null;
    role: UserRole | null;
    passwordChangedAt: string | null;
  }>>`
    select
      u.id,
      u.email,
      u.name as "displayName",
      ur.role,
      ur."passwordChangedAt"
    from "user" u
    left join user_role ur on u.id = ur.user_id
    where u.id = ${userId}
  `;
  const row = Array.isArray(result) ? result[0] : (result as any)?.[0];
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    role: row.role ?? 'user',
    passwordChangedAt: row.passwordChangedAt ?? null,
  };
}

export async function setUserRole(userId: string, role: UserRole): Promise<void> {
  const sql = await getSql();
  await sql`
    insert into user_role (id, user_id, role)
    values (${crypto.randomUUID()}, ${userId}, ${role})
    on conflict (user_id) do update
    set role = ${role}, "updatedAt" = now()
  `;
}

export async function markPasswordChanged(userId: string): Promise<void> {
  const sql = await getSql();
  await sql`
    update user_role
    set "passwordChangedAt" = now(), "updatedAt" = now()
    where user_id = ${userId}
  `;
}

export function isStaffRole(role: UserRole): boolean {
  return role === 'super_admin' || role === 'admin';
}
