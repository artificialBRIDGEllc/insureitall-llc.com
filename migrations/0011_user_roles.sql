-- User roles and permissions for console access
-- Roles: super_admin (all features), admin (manage users, see everything except dev), user (see leads only)

create table if not exists user_role (
  id text not null primary key,
  user_id text not null references "user" ("id") on delete cascade unique,
  role text not null check (role in ('super_admin', 'admin', 'user')),
  "passwordChangedAt" timestamptz,
  "createdAt" timestamptz default CURRENT_TIMESTAMP not null,
  "updatedAt" timestamptz default CURRENT_TIMESTAMP not null
);

create index if not exists user_role_user_id_idx on user_role (user_id);
create index if not exists user_role_role_idx on user_role (role);
