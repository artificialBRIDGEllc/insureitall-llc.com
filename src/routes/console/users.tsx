import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ConsoleFrame } from "@/components/console/shell";
import { ConsoleCard } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import { RequireRole } from "@/lib/auth/gates";
import { createUserAccount } from "@/routes/api/admin/create-user";

export const Route = createFileRoute("/console/users")({
  component: UsersPage,
});

function UsersPage() {
  return (
    <ConsoleFrame title="Users">
      <RequireRole role={["admin", "super_admin"]} fallback={<div>Not authorized</div>}>
        <div className="space-y-6">
          <ConsoleCard>
            <h2 className="font-sans text-base font-semibold text-navy">Create User Account</h2>
            <p className="mt-0.5 text-sm text-muted">Add a new team member to the console</p>
            <CreateUserForm />
          </ConsoleCard>
        </div>
      </RequireRole>
    </ConsoleFrame>
  );
}

function CreateUserForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setTempPassword("");

    if (!email || !name) {
      setError("Email and name are required.");
      return;
    }

    setLoading(true);
    try {
      const result = await createUserAccount({ data: { email, name, role } });
      setSuccess(`User created: ${result.email}`);
      setEmail("");
      setName("");
      setRole("user");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            className="w-full min-h-11 rounded-xl border border-border bg-surface px-4 py-2.5 text-base text-navy placeholder-muted focus:border-blue focus:ring-1 focus:ring-blue sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
            className="w-full min-h-11 rounded-xl border border-border bg-surface px-4 py-2.5 text-base text-navy placeholder-muted focus:border-blue focus:ring-1 focus:ring-blue sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-ink mb-1.5">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
            className="w-full min-h-11 rounded-xl border border-border bg-surface px-4 py-2.5 text-base text-navy focus:border-blue focus:ring-1 focus:ring-blue sm:text-sm"
          >
            <option value="user">User (leads only)</option>
            <option value="admin">Admin (full access)</option>
          </select>
        </div>
      </div>

      {error && <div className="rounded-lg bg-alert-soft p-3 text-sm text-alert">{error}</div>}

      {success && (
        <div className="rounded-lg bg-ok-soft p-3">
          <p className="text-sm text-ok font-medium">{success}</p>
          <p className="mt-2 text-xs text-muted">
            The user will receive a temporary password via email and must change it on first login.
          </p>
        </div>
      )}

      <Button disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </Button>
    </form>
  );
}
