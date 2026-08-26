import { createFileRoute } from "@tanstack/react-router";
import { PortalFrame } from "@/components/portal/shell";
import { PortalFile } from "@/components/portal-file";
import { PortalRights } from "@/components/portal-rights";
import { ConsoleCard } from "@/components/console/ui";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/portal/file")({
  component: PortalFilePage,
  head: () =>
    pageHead({
      title: "My file — fileBRIDGE",
      description: "Your coverage file. Owned and operated by artificialBRIDGE LLC.",
      path: "/portal/file",
      index: false,
    }),
});

function PortalFilePage() {
  return (
    <PortalFrame title="My file">
      <ConsoleCard>
        <p className="mb-6 max-w-xl text-sm text-ink">
          Owned and operated by artificialBRIDGE LLC. Optional doctor and
          medication names — never a Medicare number. Identifiable data is not
          used to train a model. An agency sees fields only after you consent.
        </p>
        <PortalFile />
        <PortalRights />
      </ConsoleCard>
    </PortalFrame>
  );
}
