import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/custom/header";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const Route = createFileRoute("/auth/reset-password/$token")({
  component: ResetPassword,
});

function ResetPassword() {
  const { token } = Route.useParams();

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
