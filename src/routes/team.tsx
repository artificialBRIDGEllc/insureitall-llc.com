import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/team")({ component: TeamRedirect });

function TeamRedirect() {
  return <Navigate to="/console" replace />;
}
