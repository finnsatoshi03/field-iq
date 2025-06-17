import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/custom/header";
import { CreatePasswordForm } from "@/features/auth/components/create-password-form";

export const Route = createFileRoute("/auth/create-password")({
  component: CreatePassword,
});

function CreatePassword() {
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
      <CreatePasswordForm />
    </div>
  );
}
