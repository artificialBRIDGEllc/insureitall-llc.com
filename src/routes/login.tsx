import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () =>
    pageHead({
      title: "Staff Sign In",
      description: "INSUREitALL team sign-in.",
      path: "/login",
      index: false,
    }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !isPending) {
      navigate({ to: "/console" });
    }
  }, [user, isPending, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (!res.data) {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-surface">
        <div className="h-24 w-64 animate-pulse rounded-3xl bg-soft" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-3xl bg-elevated p-8 shadow-card">
        <h1 className="font-display text-3xl font-semibold text-navy">Sign In</h1>
        <p className="mt-2 text-sm text-muted">INSUREitALL team only</p>

        <form onSubmit={handleSignIn} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-navy placeholder-muted focus:border-blue focus:ring-1 focus:ring-blue"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-navy placeholder-muted focus:border-blue focus:ring-1 focus:ring-blue"
            />
          </div>

          {error && <div className="rounded-lg bg-alert-soft p-3 text-sm text-alert">{error}</div>}

          <Button disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
