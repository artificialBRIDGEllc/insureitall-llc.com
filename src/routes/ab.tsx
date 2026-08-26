import { createFileRoute } from "@tanstack/react-router";
import { AbLegalLayout } from "@/components/ab-legal-frame";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/ab")({
  component: AbLegalLayout,
  head: () =>
    pageHead({
      title: "artificialBRIDGE LLC",
      description: "Wyoming single-member LLC. Owns and operates fileBRIDGE. Not an insurance agency.",
      path: "/ab",
    }),
});
