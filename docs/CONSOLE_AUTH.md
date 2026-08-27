# Console Authentication & Authorization

## Overview

The INSUREitALL console uses local email/password authentication with role-based access control (RBAC). No external auth broker required.

## Roles

| Role | Permissions |
|------|-------------|
| **super_admin** | View all console features including dev-only options (Engineering Debt). Create/manage admin and user accounts. |
| **admin** | View leads, usage, sessions, and compliance docs. Create/manage user accounts. Cannot see engineering debt. |
| **user** | View leads only. |

## Setup

### 1. Enable Email/Password Auth

Email/password authentication is enabled by default in `src/lib/auth/email-password.ts`:

```typescript
export const emailAndPasswordEnabled = true;
```

### 2. Seed Super Admin User

Seed the super admin account with a password via environment variable:

```bash
SUPER_ADMIN_PASSWORD="your_secure_password" node scripts/seed-super-admin.mjs
```

For a custom email and password:

```bash
SUPER_ADMIN_EMAIL="custom@email.com" SUPER_ADMIN_PASSWORD="password" node scripts/seed-super-admin.mjs
```

**Default credentials:**
- Email: `Lang@theartificialbridge.com`
- Password: Provided via `SUPER_ADMIN_PASSWORD` env var

### 3. First Login

On first login, users are prompted to change their password. This can be enforced by checking the `passwordChangedAt` field in the `user_role` table.

## Architecture

### Tables

- **user** (Better Auth) — core identity
- **session** (Better Auth) — session tokens
- **account** (Better Auth) — auth providers + password hashes
- **user_role** (custom) — role assignment + password-change tracking

### Components

| File | Purpose |
|------|---------|
| `src/lib/auth/roles.ts` | Role queries and utilities |
| `src/lib/auth/gates.tsx` | Auth UI components (SignedIn, RequireRole, etc.) |
| `src/lib/auth/middleware.ts` | Server function auth middleware |
| `src/routes/login.tsx` | Email/password sign-in form |
| `src/routes/console/` | Console pages (guarded by role) |
| `src/components/console/shell.tsx` | Console layout + role-based nav |

### Session Flow

1. User signs in at `/login` with email + password
2. Better Auth verifies credentials and creates a session
3. `useCurrentUserState()` fetches session + user role from server
4. Components render based on user role via `RequireRole` gate
5. Console nav items filtered by role hierarchy

## Usage

### Checking User Role in Components

```typescript
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { RequireRole } from "@/lib/auth/gates";

export function MyComponent() {
  const user = useCurrentUser();

  return (
    <div>
      <RequireRole role="admin" fallback={<div>Not authorized</div>}>
        <button>Admin action</button>
      </RequireRole>

      {user?.role === "super_admin" && <DevPanel />}
    </div>
  );
}
```

### Checking Role in Server Functions

```typescript
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getUserRole } from "@/lib/auth/roles";

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const role = await getUserRole(context.userId);

    if (role !== "admin" && role !== "super_admin") {
      throw new Error("Not authorized");
    }

    // admin-only action
  });
```

## Database Migration

The role system requires a migration that's auto-applied on build:

```sql
-- migrations/0011_user_roles.sql
create table if not exists user_role (
  id text not null primary key,
  user_id text not null references "user" ("id") on delete cascade unique,
  role text not null check (role in ('super_admin', 'admin', 'user')),
  "passwordChangedAt" timestamptz,
  "createdAt" timestamptz default CURRENT_TIMESTAMP not null,
  "updatedAt" timestamptz default CURRENT_TIMESTAMP not null
);
```

## Notes

- Passwords are hashed using bcrypt (via Better Auth)
- Sessions expire and are validated per-request
- Role changes take effect on next session refresh
- The dev fallback user (`dev-user` when auth is disabled) gets `user` role

## Next Steps

- [ ] Implement password change endpoint (`/api/auth/change-password`)
- [ ] Add user/admin management UI
- [ ] Add force-password-change on first login flow
- [ ] Audit log for role changes and auth events
