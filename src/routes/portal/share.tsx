import { createFileRoute } from "@tanstack/react-router";
import { PortalFrame } from "@/components/portal/shell";
import { PortalSharePanel } from "@/components/portal-share";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/portal/share")({
  component: PortalSharePage,
  head: () =>
    pageHead({
      title: "Share a copy",
      description: "Hand a one-time code. The agency connection is separate and revocable.",
      path: "/portal/share",
      index: false,
    }),
});

function PortalSharePage() {
  return (
    <PortalFrame title="Share">
      <PortalSharePanel />
    </PortalFrame>
  );
}
