import { createFileRoute } from "@tanstack/react-router";

import { SignInForm } from "@/features/auth/components/sign-in-form";
import { AuthError } from "@/features/auth/components/auth-error";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInPage,
  errorComponent: SignInErrorComponent,
});

function SignInErrorComponent() {
  return <AuthError type="sign-in" />;
}

function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-medium font-display">
          Sign In to FieldIQ
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Please enter your email and password to sign in
        </p>
      </div>
      <SignInForm />
    </div>
  );
}
