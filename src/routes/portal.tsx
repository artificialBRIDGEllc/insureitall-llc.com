import { createFileRoute } from "@tanstack/react-router";
import { PortalGate } from "@/components/portal/shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/portal")({
  component: PortalGate,
  head: () =>
    pageHead({
      title: "fileBRIDGE — artificialBRIDGE",
      description: "Beneficiary file owned by artificialBRIDGE LLC. Agencies access only with your express, scoped consent.",
      path: "/portal",
      index: false,
    }),
});
