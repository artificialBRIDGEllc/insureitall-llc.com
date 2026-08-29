import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { BRIDGET_AVATAR } from "@/lib/bridget-assets";

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
      <div className="console-app grid min-h-dvh place-items-center">
        <div className="flex flex-col items-center gap-4">
          <span className="console-bust size-14 animate-pulse">
            <img src={BRIDGET_AVATAR.bust} alt="" width={56} height={56} />
          </span>
          <p className="console-eyebrow">Checking your session</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="console-app grid min-h-dvh place-items-center px-4 py-10">
      <div className="console-card w-full max-w-sm p-7 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="console-bust size-11 shrink-0">
            <img src={BRIDGET_AVATAR.bust} alt="" width={44} height={44} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[0.95rem] font-semibold tracking-tight text-navy">
              BRIDGE<span className="italic text-blue">t</span>
            </span>
            <span className="block text-[0.65rem] font-semibold tracking-[0.2em] text-muted uppercase">
              Console
            </span>
          </span>
        </div>

        <h1 className="mt-6 font-display text-3xl font-semibold text-navy">Team Login</h1>
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
              autoComplete="email"
              required
              className="w-full min-h-11 rounded-xl border border-border bg-surface px-4 py-2.5 text-base text-navy placeholder-muted focus:border-blue focus:ring-1 focus:ring-blue sm:text-sm"
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
              autoComplete="current-password"
              required
              className="w-full min-h-11 rounded-xl border border-border bg-surface px-4 py-2.5 text-base text-navy placeholder-muted focus:border-blue focus:ring-1 focus:ring-blue sm:text-sm"
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
