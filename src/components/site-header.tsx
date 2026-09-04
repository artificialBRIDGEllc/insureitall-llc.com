import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Logo } from "@/components/logo";
import { CallLink } from "@/components/call-link";
import { Button } from "@/components/ui/button";
import { HOURS, PHONE_DISPLAY } from "@/lib/utils";
import { isStaffUser } from "@/lib/staff";

const nav = [
  { to: "/needs-analysis", label: "Needs Analysis" },
  { to: "/compare", label: "Plan Choice Audit" },
  { to: "/bridget", label: "BRIDGEt" },
  { to: "/medicare-basics", label: "Medicare Basics" },
  { to: "/contact", label: "Contact" },
];

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-soft" />;
  }
  if (user) {
    return (
      <div className="hidden items-center gap-3 lg:flex">
        {isStaffUser(user) ? (
          <Link to="/console" className="text-sm font-medium text-navy hover:text-blue">
            Console
          </Link>
        ) : null}
        <UserButton />
      </div>
    );
  }
  return (
    <Link to="/portal" className="hidden text-sm font-medium text-muted hover:text-navy lg:inline">
      Client Portal
    </Link>
  );
}

function StaffMobileLink() {
  const { user } = useCurrentUserState();
  if (!isStaffUser(user)) return null;
  return (
    <Link
      to="/console"
      className="rounded-xl px-3 py-3 text-base font-medium text-navy hover:bg-soft"
    >
      Console
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-navy text-elevated">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6">
          <p>Licensed agents available — {HOURS}</p>
          <CallLink className="inline-flex items-center gap-1.5 font-medium">
            <Phone className="size-3.5" />
            {PHONE_DISPLAY}
          </CallLink>
        </div>
      </div>
      <div className="border-b border-border bg-elevated/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" aria-label="INSUREitALL home" onClick={() => setOpen(false)}>
            <Logo variant="wordmark" className="h-8 sm:h-9" />
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-blue"
                activeProps={{ className: "inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:text-blue" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <AuthSlot />
            <Button asChild size="sm" variant="navy" className="hidden sm:inline-flex">
              <CallLink>Talk to an Agent</CallLink>
            </Button>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-xl text-navy lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-border px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-xl px-3 py-3 text-base font-medium text-navy hover:bg-soft"
                  activeProps={{
                    className:
                      "rounded-xl px-3 py-3 text-base font-semibold text-blue hover:bg-soft",
                  }}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <SignedOut>
                <Link
                  to="/portal"
                  className="rounded-xl px-3 py-3 text-base font-medium text-navy hover:bg-soft"
                  onClick={() => setOpen(false)}
                >
                  Client Portal
                </Link>
              </SignedOut>
              <SignedIn>
                <StaffMobileLink />
                <div className="px-3 py-2">
                  <UserButton />
                </div>
              </SignedIn>
              <CallLink className="mt-2 inline-flex min-h-11 items-center justify-center rounded-xl bg-navy px-4 font-medium text-elevated">
                Call {PHONE_DISPLAY}
              </CallLink>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}