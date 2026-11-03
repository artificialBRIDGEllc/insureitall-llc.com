import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/onboarding/admin")({
  component: OnboardingAdmin,
  head: () =>
    pageHead({
      title: "Operations console",
      description: "Review and confirm new-hire onboarding steps.",
      path: "/onboarding/admin",
      index: false,
    }),
});

function OnboardingAdmin() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Operations</h1>
      <p className="mt-2 text-muted-foreground">
        Queue, hire detail, confirm / return / undo, Checkr, owner sections, annual refresh, and offboarding.
      </p>
      <div className="mt-8 rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Admin console scaffold. Staff sign-in via team-iia.com Google + allowlist required before use.
        </p>
      </div>
    </div>
  );
}
