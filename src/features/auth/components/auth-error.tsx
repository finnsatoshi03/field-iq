import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";

interface ErrorItemProps {
  text: string;
}

const ErrorItem = ({ text }: ErrorItemProps) => {
  return (
    <div className="flex items-center gap-1">
      <div className="transition-all duration-300 ease-in-out">
        <XCircle className="size-6 text-red-500" />
      </div>
      <p className="px-4 py-1.5 rounded bg-accent text-accent-foreground font-medium text-sm leading-relaxed">
        {text}
      </p>
    </div>
  );
};

type AuthErrorType =
  | "reset-password"
  | "sign-in"
  | "create-password"
  | "forgot-password"
  | "generic";

interface AuthErrorAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "secondary";
}

interface AuthErrorProps {
  type?: AuthErrorType;
  errors?: string[];
  actions?: AuthErrorAction[];
}

const getDefaultErrorConfig = (type: AuthErrorType) => {
  switch (type) {
    case "reset-password":
      return {
        errors: [
          "The reset link has expired",
          "The reset link is invalid",
          "The reset link has already been used",
        ],
        actions: [
          {
            label: "Request a New Link",
            href: "/auth/forgot-password",
            variant: "secondary" as const,
          },
          {
            label: "Go back to Sign in",
            href: "/auth/sign-in",
            variant: "default" as const,
          },
        ],
      };
    case "sign-in":
      return {
        errors: [
          "Invalid email or password",
          "Your account may be locked",
          "Network connection issues",
        ],
        actions: [
          {
            label: "Try Again",
            onClick: () => window.location.reload(),
            variant: "secondary" as const,
          },
          {
            label: "Forgot Password?",
            href: "/auth/forgot-password",
            variant: "default" as const,
          },
        ],
      };
    case "create-password":
      return {
        errors: [
          "The invitation link has expired",
          "The invitation link is invalid",
          "This account has already been activated",
        ],
        actions: [
          {
            label: "Contact IT Support",
            onClick: () => {},
            variant: "secondary" as const,
          },
          {
            label: "Go back to Sign in",
            href: "/auth/sign-in",
            variant: "default" as const,
          },
        ],
      };
    case "forgot-password":
      return {
        errors: [
          "Email address not found",
          "Account may be deactivated",
          "Network connection issues",
        ],
        actions: [
          {
            label: "Try Again",
            onClick: () => window.location.reload(),
            variant: "secondary" as const,
          },
          {
            label: "Go back to Sign in",
            href: "/auth/sign-in",
            variant: "default" as const,
          },
        ],
      };
    default:
      return {
        errors: [
          "Something unexpected happened",
          "Please try again later",
          "If the problem persists, contact support",
        ],
        actions: [
          {
            label: "Try Again",
            onClick: () => window.location.reload(),
            variant: "secondary" as const,
          },
          {
            label: "Go back to Sign in",
            href: "/auth/sign-in",
            variant: "default" as const,
          },
        ],
      };
  }
};

export const AuthError = ({
  type = "generic",
  errors,
  actions,
}: AuthErrorProps) => {
  const defaultConfig = getDefaultErrorConfig(type);
  const finalErrors = errors || defaultConfig.errors;
  const finalActions = actions || defaultConfig.actions;

  const handleActionClick = (action: AuthErrorAction) => {
    if (action.onClick) {
      action.onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: AuthErrorAction) => {
    if (e.key === "Enter") {
      handleActionClick(action);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-center">
        {/* Square template holder for future component */}
        <div className="size-32 bg-muted rounded-lg flex items-center justify-center">
          <svg
            className="size-10 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-medium font-display text-center">
          Something went wrong
        </h1>

        <div className="grid gap-2 items-center justify-center">
          <p className="text-muted-foreground text-center">
            The error might be:
          </p>

          <div className="grid gap-1">
            {finalErrors.map((error, index) => (
              <ErrorItem key={index} text={error} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        {finalActions.map((action, index) =>
          action.href ? (
            <Link key={index} to={action.href}>
              <Button
                type="button"
                size="sm"
                className={
                  action.variant === "secondary"
                    ? "w-full bg-muted text-muted-foreground hover:bg-muted/80"
                    : "w-full"
                }
              >
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button
              key={index}
              onClick={() => handleActionClick(action)}
              className={
                action.variant === "secondary"
                  ? "w-full bg-muted text-muted-foreground hover:bg-muted/80"
                  : "w-full"
              }
              tabIndex={0}
              aria-label={action.label}
              onKeyDown={(e) => handleKeyDown(e, action)}
            >
              {action.label}
            </Button>
          )
        )}

        <p className="text-xs text-center text-muted-foreground">
          Having trouble? Contact your IT team
        </p>
      </div>
    </div>
  );
};
