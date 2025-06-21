import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Header } from "@/components/custom/header";
import { CreatePasswordForm } from "@/features/auth/components/create-password-form";
import { AuthSuccess } from "@/features/auth/components/auth-success";
import { checkAuthRedirect } from "@/hooks/use-auth-redirect";
import type { UserRole } from "@/lib/types";

export const Route = createFileRoute("/auth/create-password")({
  beforeLoad: () => {
    // Redirect authenticated users to their dashboard
    checkAuthRedirect();
  },
  component: CreatePassword,
});

function CreatePassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [userRole] = useState<UserRole>("admin"); // This should come from context or props

  const handlePasswordCreated = () => {
    setIsSuccess(true);
  };

  // Show success state
  if (isSuccess) {
    return (
      <div className="space-y-10">
        <Header />
        <AuthSuccess type="create-password" role={userRole} />
      </div>
    );
  }

  // Show form state
  return (
    <div className="space-y-10">
      <Header variant="logo" className="h-28" />

      <div className="space-y-2">
        <h1 className="text-2xl font-medium font-display">
          Create Your Password
        </h1>
        <p className="text-sm max-w-xs leading-4">
          Enter your desired password below. This will be used to sign in to
          your account along with your email address.
        </p>
      </div>
      <CreatePasswordForm onSuccess={handlePasswordCreated} />
    </div>
  );
}
