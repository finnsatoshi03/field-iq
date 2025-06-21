import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/custom/header";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-pass-form";
import { checkAuthRedirect } from "@/hooks/use-auth-redirect";

export const Route = createFileRoute("/auth/forgot-password")({
  beforeLoad: () => {
    // Redirect authenticated users to their dashboard
    checkAuthRedirect();
  },
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <div className="space-y-10">
      <Header variant="logo" className="h-28" />

      <div className="space-y-2">
        <h1 className="text-2xl font-medium font-display">
          Reset Your Password
        </h1>
        <p className="text-sm max-w-xs leading-4">
          Enter your email address and we'll send you instructions to reset your
          password
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
