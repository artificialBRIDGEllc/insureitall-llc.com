import { createFileRoute, Navigate } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  component: LoginRedirect,
  head: () =>
    pageHead({
      title: "Sign in",
      description: "INSUREitALL client portal sign-in.",
      path: "/login",
      index: false,
    }),
});

function LoginRedirect() {
  return <Navigate to="/portal" replace />;
}
