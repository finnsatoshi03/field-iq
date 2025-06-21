import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Header } from "@/components/custom/header";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { AuthError } from "@/features/auth/components/auth-error";

const resetPasswordSearchSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const Route = createFileRoute("/auth/reset-password")({
  validateSearch: resetPasswordSearchSchema,
  component: ResetPassword,
  errorComponent: ResetPasswordErrorComponent,
});

function ResetPasswordErrorComponent() {
  return (
    <div className="space-y-10">
      <Header />
      <AuthError type="reset-password" />
    </div>
  );
}

function ResetPassword() {
  const { token } = Route.useSearch();

  // Validate token format (basic validation)
  const isValidTokenFormat = token && token.length > 10;

  if (!isValidTokenFormat) {
    return (
      <div className="space-y-10">
        <Header />
        <AuthError
          type="reset-password"
          errors={[
            "The reset token is missing or invalid",
            "The reset link may be corrupted",
            "Please request a new reset link",
          ]}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Header variant="logo" className="h-28" />

      <div className="space-y-2">
        <h1 className="text-2xl font-medium font-display">
          Reset Your Password
        </h1>
        <p className="text-sm max-w-xs leading-4">
          Enter your new password below. This will replace your current password
          and be used to sign in to your account.
        </p>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  );
}
