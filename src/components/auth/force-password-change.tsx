import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { ChangePasswordForm } from "./change-password";
import { authClient } from "@/lib/auth/client";

/**
 * Modal that forces password change on first login.
 * Shown when user.passwordChangedAt is null.
 */
export function ForcePasswordChangeGate({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Check if password change is needed
  useEffect(() => {
    if (!user || user.isDevFallback) return;

    // Fetch user role data which includes passwordChangedAt
    const checkPasswordStatus = async () => {
      try {
        const { getUserRoleServer } = await import("@/routes/api/auth/user-role");
        const userWithRole = await getUserRoleServer();

        if (userWithRole && !userWithRole.passwordChangedAt) {
          setShowModal(true);
        }
      } catch (err) {
        console.error("Failed to check password status:", err);
      }
    };

    checkPasswordStatus();
  }, [user?.id]);

  const handlePasswordChanged = async () => {
    setShowModal(false);
    // Refresh session to update passwordChangedAt
    try {
      await authClient.getSession();
    } catch (err) {
      console.error("Failed to refresh session:", err);
    }
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-navy/50 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-3xl bg-elevated p-8 shadow-lift">
          <h1 className="font-display text-3xl font-semibold text-navy">Set Your Password</h1>
          <p className="mt-2 text-sm text-muted">
            Please create a new password to secure your account.
          </p>

          <div className="mt-6">
            <ChangePasswordForm isRequired onSuccess={handlePasswordChanged} />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
