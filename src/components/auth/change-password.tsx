import { useState } from "react";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/routes/api/auth/change-password";

export function ChangePasswordForm({
  onSuccess,
  isRequired,
}: {
  onSuccess?: () => void;
  isRequired?: boolean;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isRequired && !currentPassword) {
      setError("Current password is required.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword === currentPassword && !isRequired) {
      setError("New password must be different from current password.");
      return;
    }

    setLoading(true);
    try {
      const result = await (changePassword as any)({
        currentPassword: isRequired ? undefined : currentPassword,
        newPassword,
      });

      if (result.success) {
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isRequired && (
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-ink mb-1.5">
            Current Password
          </label>
          <input
            type="password"
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-navy placeholder-muted focus:border-blue focus:ring-1 focus:ring-blue"
          />
        </div>
      )}

      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-ink mb-1.5">
          New Password
        </label>
        <input
          type="password"
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-navy placeholder-muted focus:border-blue focus:ring-1 focus:ring-blue"
        />
        <p className="mt-1.5 text-xs text-muted">At least 8 characters</p>
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-ink mb-1.5">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-navy placeholder-muted focus:border-blue focus:ring-1 focus:ring-blue"
        />
      </div>

      {error && <div className="rounded-lg bg-alert-soft p-3 text-sm text-alert">{error}</div>}

      <Button disabled={loading} className="w-full">
        {loading ? "Updating..." : "Change Password"}
      </Button>
    </form>
  );
}
