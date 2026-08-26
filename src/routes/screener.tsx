import { createFileRoute, Navigate } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/screener")({
  component: ScreenerHeld,
  head: () =>
    pageHead({
      title: "Moved",
      description: "This tool is not on the INSUREitALL public site.",
      path: "/screener",
      index: false,
    }),
});

function ScreenerHeld() {
  return <Navigate to="/" replace />;
}
