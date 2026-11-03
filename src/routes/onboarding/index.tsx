import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingHome,
  head: () =>
    pageHead({
      title: "New hire onboarding",
      description: "Complete your onboarding steps in order.",
      path: "/onboarding",
      index: false,
    }),
});

function OnboardingHome() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Onboarding</h1>
      <p className="mt-2 text-muted-foreground">
        Sign in with the email address on your invitation. Steps must be completed in order.
      </p>
      <div className="mt-8 rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Portal foundation is in place. Full step engine, document signing, and Operations console are next.
        </p>
      </div>
    </div>
  );
}
