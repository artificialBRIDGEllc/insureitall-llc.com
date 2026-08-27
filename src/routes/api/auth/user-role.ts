import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getUserWithRole } from "@/lib/auth/roles";

export const getUserRoleServer = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const user = await getUserWithRole(context.userId);
    return user ?? null;
  });
