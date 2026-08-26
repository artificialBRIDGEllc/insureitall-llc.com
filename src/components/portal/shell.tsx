import { Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import { Building2, FileText, Headphones, Home, Menu, Share2, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { AbLockup } from "@/components/ab-mark";
import { PortalWelcome } from "@/components/portal/welcome";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AB_PRODUCT } from "@/lib/ab";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/portal", label: "Home", icon: Home, end: true },
  { to: "/portal/file", label: "My file", icon: FileText, end: false },
  { to: "/portal/agency", label: "Agency", icon: Building2, end: false },
  { to: "/portal/share", label: "Share", icon: Share2, end: false },
  { to: "/portal/help", label: "Help", icon: Headphones, end: false },
] as const;

function pathOn(pathname: string, to: string, end: boolean) {
  if (end) return pathname === to || pathname === `${to}/`;
  return pathname === to || pathname.startsWith(`${to}/`);
}

function SidebarNav({ onGo }: { onGo?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 pb-6">
      {NAV.map((item) => (
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
    </nav>
  );
}

function BrandLockup() {
  return (
    <Link to="/portal" className="flex items-center gap-3 px-4 py-5 text-[inherit]">
      <AbLockup />
    </Link>
  );
}

export function PortalFrame({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (document.getElementById("ab-manrope")) return;
    const link = document.createElement("link");
    link.id = "ab-manrope";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;800&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="ab-portal console-app lg:grid lg:grid-cols-[16.25rem_1fr]">
      <aside className="console-sidebar hidden min-h-dvh flex-col lg:flex">
        <BrandLockup />
        <SidebarNav />
        <p className="px-5 pb-5 text-[0.7rem] leading-relaxed text-elevated/40">
          {AB_PRODUCT} · owned and operated by artificialBRIDGE LLC.{" "}
          <Link to="/ab/privacy" className="underline">
            privacy
          </Link>{" "}
          ·{" "}
          <Link to="/ab/terms" className="underline">
            terms
          </Link>{" "}
          ·{" "}
          <Link to="/ab" className="underline">
            entity
          </Link>
        </p>
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
            <SidebarNav onGo={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="grid size-11 place-items-center rounded-xl bg-[var(--ab-surface)] text-[var(--ab-ink)] lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="truncate font-sans text-2xl font-semibold tracking-tight lowercase text-[var(--ab-ink)] sm:text-[1.65rem]">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-[0.65rem] tracking-[0.28em] text-[var(--ab-ink-3)] sm:inline">
              {AB_PRODUCT}
            </span>
            <div className="hidden sm:block">
              <UserButton />
            </div>
          </div>
        </header>
        <div className="min-w-0 flex-1 px-4 pb-16 sm:px-8">{children}</div>
      </div>
    </div>
  );
}

export function PortalGate() {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-surface">
        <div className="h-24 w-64 animate-pulse rounded-3xl bg-soft" />
      </div>
    );
  }

  if (!user) {
    if (pathname !== "/portal") return <Navigate to="/portal" replace />;
    return <PortalWelcome />;
  }

  return <Outlet />;
}
