import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/custom/header";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { AuthError } from "@/features/auth/components/auth-error";
import { checkAuthRedirect } from "@/hooks/use-auth-redirect";

export const Route = createFileRoute("/auth/sign-in")({
  beforeLoad: () => {
    // Redirect authenticated users to their dashboard
    checkAuthRedirect();
  },
  component: SignInPage,
  errorComponent: SignInErrorComponent,
});

function SignInErrorComponent() {
  return (
    <div className="space-y-10 p-4">
      <Header />
      <AuthError type="sign-in" />
    </div>
  );
}

function SignInPage() {
  return (
    <div className="space-y-10 p-4 container mx-auto">
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
