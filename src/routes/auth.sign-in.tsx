import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/custom/header";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="space-y-12">
      <Header variant="logo" className="h-28" />

      <div className="space-y-2">
        <h1 className="text-2xl font-medium font-display">
          Sign In to FieldIQ
        </h1>
        <p className="text-sm max-w-xs leading-4">
          Welcome back! Please enter your email and password to sign in
        </p>
      </div>
      <SignInForm />
    </div>
  );
}
