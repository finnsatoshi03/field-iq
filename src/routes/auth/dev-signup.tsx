import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Header } from "@/components/custom/header";
import { DevSignUpForm } from "@/features/auth/components/dev-signup-form";
import { AuthError } from "@/features/auth/components/auth-error";
import { DEV_SIGNUP_CONFIG } from "@/lib/config";
import { checkAuthRedirect } from "@/hooks/use-auth-redirect";

const devSignupSearchSchema = z.object({
  key: z.string().optional(),
});

export const Route = createFileRoute("/auth/dev-signup")({
  beforeLoad: () => {
    // Redirect authenticated users to their dashboard
    checkAuthRedirect();
  },
  component: DevSignUpPage,
  errorComponent: DevSignUpErrorComponent,
  validateSearch: devSignupSearchSchema,
});

function DevSignUpErrorComponent() {
  return (
    <div className="space-y-10">
      <Header />
      <AuthError type="generic" />
    </div>
  );
}

function DevSignUpPage() {
  const { key } = Route.useSearch();

  const isValidAccessKey =
    key === DEV_SIGNUP_CONFIG.accessKey && DEV_SIGNUP_CONFIG.enabled;

  if (!isValidAccessKey) {
    return <AccessDeniedPage providedKey={key} />;
  }

  return (
    <div className="space-y-10">
      <Header variant="logo" className="h-28" />

      <div className="space-y-2">
        <h1 className="text-2xl font-medium font-display">
          🔐 Developer Sign Up
        </h1>
        <p className="text-sm max-w-xs leading-4">
          Secret developer access only. Create your development account to get
          started.
        </p>
      </div>

      <DevSignUpForm />

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          ⚠️ This page is for authorized developers only
        </p>
      </div>
    </div>
  );
}

function AccessDeniedPage({ providedKey }: { providedKey?: string }) {
  return (
    <div className="space-y-10">
      <Header variant="logo" className="h-28" />

      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="size-32 bg-red-50 rounded-lg flex items-center justify-center">
            <svg
              className="size-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-medium font-display text-red-600">
            🚫 Access Denied
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {providedKey
              ? "Invalid access key provided. This incident may be logged."
              : "Access key required. This page is restricted to authorized developers only."}
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg max-w-md mx-auto">
          <p className="text-xs text-muted-foreground">
            <strong>For authorized developers:</strong>
            <br />
            Contact your system administrator for the correct access key.
            <br />
            <br />
            <strong>Usage:</strong> /auth/dev-signup?key=YOUR_ACCESS_KEY
          </p>
        </div>

        <div className="pt-4">
          <a
            href="/auth/sign-in"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
