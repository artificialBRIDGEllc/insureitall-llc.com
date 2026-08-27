import { Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Clock,
  LayoutGrid,
  ListTodo,
  Menu,
  ScrollText,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUser, useCurrentUserState } from "@/lib/auth/use-current-user";
import { ForcePasswordChangeGate } from "@/components/auth/force-password-change";
import { BRIDGET_AVATAR } from "@/lib/bridget-assets";
import { Button } from "@/components/ui/button";
import { isStaffUser } from "@/lib/staff";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/console", label: "Overview", icon: LayoutGrid, end: true, minRole: "user" as const },
  { to: "/console/leads", label: "Leads", icon: Users, end: false, minRole: "user" as const },
  { to: "/console/usage", label: "Usage & feature stats", icon: BarChart3, end: false, minRole: "admin" as const },
  { to: "/console/sessions", label: "BRIDGEt sessions", icon: Clock, end: false, minRole: "admin" as const },
  { to: "/console/users", label: "Team members", icon: Settings, end: false, minRole: "admin" as const },
] as const;

const COMPLIANCE = [
  { to: "/console/consent", label: "Consent & retention", icon: Shield, minRole: "admin" as const },
  { to: "/console/audit", label: "Audit log", icon: ScrollText, minRole: "admin" as const },
  { to: "/console/debt", label: "Engineering debt", icon: ListTodo, minRole: "super_admin" as const },
] as const;

const ROLE_HIERARCHY = { user: 1, admin: 2, super_admin: 3 };
function canView(userRole: string | undefined, requiredRole: string): boolean {
  if (!userRole) return false;
  return (ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0) >= (ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0);
}

function pathOn(pathname: string, to: string, end: boolean) {
  if (end) return pathname === to || pathname === `${to}/`;
  return pathname === to || pathname.startsWith(`${to}/`);
}

function SidebarNav({ onGo, userRole }: { onGo?: () => void; userRole?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-6">
      {NAV.filter((item) => canView(userRole, item.minRole)).map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onGo}
          className={cn("console-nav-item", pathOn(pathname, item.to, item.end) && "is-on")}
        >
          <item.icon className="size-4 shrink-0" />
          {item.label}
        </Link>
      ))}
      {COMPLIANCE.some((item) => canView(userRole, item.minRole)) && (
        <>
          <p className="mt-6 mb-1 px-3 text-[0.65rem] font-semibold tracking-[0.18em] text-elevated/40 uppercase">
            Compliance
          </p>
          {COMPLIANCE.filter((item) => canView(userRole, item.minRole)).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onGo}
              className={cn("console-nav-item", pathOn(pathname, item.to, false) && "is-on")}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </>
      )}
    </nav>
  );
}

function BrandLockup() {
  return (
    <Link to="/console" className="flex items-center gap-3 px-5 py-6 text-elevated">
      <span className="console-bust size-10 shrink-0">
        <img
          src={BRIDGET_AVATAR.bust}
          alt=""
          width={40}
          height={40}
          loading="eager"
          decoding="async"
        />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[0.95rem] font-semibold tracking-tight">
          BRIDGE<span className="italic text-blue">t</span>
        </span>
        <span className="block text-[0.65rem] font-semibold tracking-[0.2em] text-elevated/45 uppercase">
          Console
        </span>
      </span>
    </Link>
  );
}

export function ConsoleFrame({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();
  const userRole = user?.role;

  return (
    <div className="console-app lg:grid lg:grid-cols-[16.25rem_1fr]">
      <aside className="console-sidebar sticky top-0 hidden h-dvh flex-col lg:flex">
        <BrandLockup />
        <SidebarNav userRole={userRole} />
        <div className="mx-3 mb-5 rounded-xl border border-elevated/10 bg-elevated/[0.04] px-4 py-3">
          <p className="console-eyebrow text-gold/70">INSUREitALL team only</p>
          <p className="mt-1.5 text-[0.7rem] leading-relaxed text-elevated/45">
            BRIDGEt is an advocate, not a licensed agent. No SSN or Medicare numbers.
          </p>
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy/50"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="console-sidebar relative flex h-full w-[16.5rem] flex-col shadow-lift">
            <div className="flex items-center justify-between pr-2">
              <BrandLockup />
              <button
                type="button"
                className="mr-3 grid size-11 place-items-center rounded-xl text-elevated"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <SidebarNav userRole={userRole} onGo={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-col">
        <header className="console-header flex items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="grid size-11 place-items-center rounded-xl bg-elevated text-navy shadow-card lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="truncate font-display text-2xl font-semibold tracking-tight text-navy sm:text-[1.7rem]">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <div className="hidden sm:block">
              <UserButton />
            </div>
          </div>
        </header>
        <div className="min-w-0 flex-1 px-4 pt-6 pb-16 sm:px-8">{children}</div>
      </div>
    </div>
  );
}

export function ConsoleGate() {
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return (
      <div className="console-app grid min-h-dvh place-items-center">
        <div className="flex flex-col items-center gap-4">
          <span className="console-bust size-14 animate-pulse">
            <img src={BRIDGET_AVATAR.bust} alt="" width={56} height={56} />
          </span>
          <p className="console-eyebrow">Opening the console</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.role || (user.role !== 'super_admin' && user.role !== 'admin' && user.role !== 'user')) {
    return (
      <div className="console-app grid min-h-dvh place-items-center px-4">
        <div className="console-card max-w-md p-8">
          <p className="console-eyebrow">INSUREitALL team only</p>
          <h1 className="mt-2 font-display text-3xl text-navy">Access Denied</h1>
          <p className="mt-3 text-ink">
            Your account doesn't have console access. Signed in as{" "}
            {user.primaryEmail ?? user.displayName}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/">Home</Link>
            </Button>
            <UserButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ForcePasswordChangeGate>
      <Outlet />
    </ForcePasswordChangeGate>
  );
}
