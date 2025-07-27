import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { AuthError } from "@/features/auth/components/auth-error";
import { UpdatePasswordAlertDialog } from "@/features/auth/components/update-password-alert-dialog";
import { authService } from "@/services/auth-service";

const resetPasswordSearchSchema = z.object({
  access_token: z.string().optional(),
  expires_at: z.string().optional(),
  expires_in: z.string().optional(),
  refresh_token: z.string().optional(),
  token_type: z.string().optional(),
  type: z.string().optional(),
});

export const Route = createFileRoute("/auth/reset-password")({
  validateSearch: resetPasswordSearchSchema,
  component: ResetPassword,
  errorComponent: ResetPasswordErrorComponent,
});

function ResetPasswordErrorComponent() {
  return (
    <div className="space-y-10">
      <AuthError type="reset-password" />
    </div>
  );
}

function ResetPassword() {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [isRecoveryFlow, setIsRecoveryFlow] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const search = Route.useSearch();

  useEffect(() => {
    // Check if this is a recovery flow from URL parameters
    if (
      search.type === "recovery" &&
      search.access_token &&
      search.refresh_token
    ) {
      // Set the session using the tokens from URL
      const setSessionFromTokens = async () => {
        try {
          const { error } = await authService.setSession({
            access_token: search.access_token!,
            refresh_token: search.refresh_token!,
          });

          if (error) {
            console.error("Error setting session:", error);
          } else {
            // Get user email for display
            const user = await authService.getCurrentUser();
            setUserEmail(user?.email);
            setIsRecoveryFlow(true);
            setShowUpdateDialog(true);
          }
        } catch (error) {
          console.error("Error setting session:", error);
        }
      };

      setSessionFromTokens();
    }

    // Listen for auth state changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecoveryFlow(true);
        setShowUpdateDialog(true);
      } else if (
        event === "SIGNED_IN" &&
        session &&
        search.type === "recovery"
      ) {
        setIsRecoveryFlow(true);
        setShowUpdateDialog(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [search]);

  const handleDialogComplete = () => {
    setShowUpdateDialog(false);
    // Redirect to sign in after closing
    window.location.href = "/auth/sign-in";
  };

  if (isRecoveryFlow) {
    return (
      <div className="space-y-10">
        <div className="space-y-2">
          <h1 className="text-2xl font-medium font-display">
            Reset Your Password
          </h1>
          <p className="text-sm max-w-xs leading-4">
            You have been successfully authenticated. Please set your new
            password below.
          </p>
        </div>

        <UpdatePasswordAlertDialog
          open={showUpdateDialog}
          onComplete={handleDialogComplete}
          userEmail={userEmail}
          type="reset"
        />
      </div>
    );
  }

  // If not a recovery flow, redirect to forgot password
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium font-display">
          Invalid Reset Link
        </h1>
        <p className="text-sm max-w-xs leading-4">
          This reset link is invalid or has expired. Please request a new
          password reset.
        </p>
      </div>
      <div className="text-center">
        <Link to="/auth/forgot-password">
          <Button className="w-full">Request new reset link</Button>
        </Link>
      </div>
    </div>
  );
}
