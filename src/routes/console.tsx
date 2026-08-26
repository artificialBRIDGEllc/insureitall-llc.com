import { createFileRoute } from "@tanstack/react-router";
import { ConsoleGate } from "@/components/console/shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/console")({
  component: ConsoleGate,
  head: () =>
    pageHead({
      title: "BRIDGEt Console",
      description: "INSUREitALL team desk. Staff only.",
      path: "/console",
      index: false,
    }),
});