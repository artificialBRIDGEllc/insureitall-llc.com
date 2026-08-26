import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/field";

export function PortalEmailAuth({
  callbackURL = "/portal",
}: {
  callbackURL?: string;
}) {
  const [mode, setMode] = useState<"signup" | "signin">(
    callbackURL === "/team" || callbackURL === "/console" ? "signin" : "signup",
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();
    try {
      if (mode === "signup") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0],
          callbackURL,
        });
        if (err) throw new Error(err.message || "Could not create the account.");
      } else {
        const { error: err } = await authClient.signIn.email({
          email,
          password,
          callbackURL,
        });
        if (err) throw new Error(err.message || "Could not sign in.");
      }
      window.location.assign(callbackURL);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex gap-3 text-sm">
        <button
          type="button"
          className={mode === "signup" ? "font-semibold text-navy" : "text-muted"}
          onClick={() => setMode("signup")}
        >
          Create account
        </button>
        <span className="text-border">·</span>
        <button
          type="button"
          className={mode === "signin" ? "font-semibold text-navy" : "text-muted"}
          onClick={() => setMode("signin")}
        >
          Sign in
        </button>
      </div>
      {mode === "signup" ? (
        <Field label="Name" name="name" autoComplete="name" required />
      ) : null}
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        minLength={8}
        required
      />
      {error ? <p className="text-xs text-blue">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy
          ? "Working…"
          : mode === "signup"
            ? "Create no-cost account"
            : "Sign in"}
      </Button>
    </form>
  );
}
