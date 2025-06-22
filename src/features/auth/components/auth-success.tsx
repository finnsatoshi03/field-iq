import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import type { UserRole } from "@/lib/types";

interface SuccessItemProps {
  text: string;
}

const SuccessItem = ({ text }: SuccessItemProps) => {
  return (
    <div className="flex items-center gap-1">
      <div className="transition-all duration-300 ease-in-out">
        <CheckCircle2 className="size-6 text-green-500" />
      </div>
      <p className="px-4 py-1.5 rounded bg-accent text-accent-foreground font-medium text-sm leading-relaxed">
        {text}
      </p>
    </div>
  );
};

type AuthSuccessType =
  | "create-password"
  | "reset-password"
  | "sign-in"
  | "forgot-password"
  | "generic";

interface AuthSuccessAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "secondary";
}

interface AuthSuccessProps {
  type?: AuthSuccessType;
  role?: UserRole;
  title?: string;
  description?: string;
  features?: string[];
  actions?: AuthSuccessAction[];
}

const getDefaultSuccessConfig = (type: AuthSuccessType, role?: UserRole) => {
  switch (type) {
    case "create-password":
      const roleConfigs = {
        admin: {
          title: "You're all set!",
          description:
            "Your admin password has been created successfully. Welcome to your FieldIQ company dashboard!",
          features: [
            "Browse your company dashboard",
            "Customize your company settings",
            "Add your first sales representative",
            "Check out analytics and reports",
          ],
          actions: [
            {
              label: "Take Me to Dashboard",
              href: "/admin",
              variant: "default" as const,
            },
          ],
        },
        sales_rep: {
          title: "You're all set!",
          description:
            "Your sales password has been created successfully. Welcome to your FieldIQ sales dashboard!",
          features: [
            "View your assigned territories",
            "Manage your farmer relationships",
            "Track your sales performance",
            "Access sales tools and resources",
          ],
          actions: [
            {
              label: "Take Me to Dashboard",
              href: "/sales",
              variant: "default" as const,
            },
          ],
        },
        farmer: {
          title: "You're all set!",
          description:
            "Your farmer password has been created successfully. Welcome to your FieldIQ farmer portal!",
          features: [
            "View your field data and insights",
            "Track your crop performance",
            "Access farming recommendations",
            "Connect with your sales representative",
          ],
          actions: [
            {
              label: "Take Me to Dashboard",
              href: "/farmer",
              variant: "default" as const,
            },
          ],
        },
        dev: {
          title: "You're all set!",
          description:
            "Your developer password has been created successfully. Welcome to your FieldIQ developer portal!",
          features: [
            "Access development tools and resources",
            "Test application features",
            "View system logs and analytics",
            "Configure development settings",
          ],
          actions: [
            {
              label: "Take Me to Dashboard",
              href: "/dev",
              variant: "default" as const,
            },
          ],
        },
      };
      return roleConfigs[role || "admin"];

    case "reset-password":
      return {
        title: "Password Reset Complete!",
        description:
          "Your password has been successfully updated. You can now sign in with your new password.",
        features: [
          "Your account is secure and ready to use",
          "All devices have been logged out for security",
          "You can now access all your account features",
        ],
        actions: [
          {
            label: "Continue to Sign In",
            href: "/auth/sign-in",
            variant: "default" as const,
          },
        ],
      };

    case "sign-in":
      return {
        title: "Welcome back!",
        description: "You have successfully signed in to your FieldIQ account.",
        features: [
          "All your data is up to date",
          "Access to all available features",
          "Secure connection established",
        ],
        actions: [
          {
            label: "Go to Dashboard",
            href: "/",
            variant: "default" as const,
          },
        ],
      };

    case "forgot-password":
      return {
        title: "Email Sent Successfully!",
        description:
          "We've sent a password reset link to your email address. Check your inbox and follow the instructions.",
        features: [
          "Reset link expires in 24 hours",
          "Check your spam folder if needed",
          "You can request a new link anytime",
        ],
        actions: [
          {
            label: "Back to Sign In",
            href: "/auth/sign-in",
            variant: "default" as const,
          },
        ],
      };

    default:
      return {
        title: "Success!",
        description: "Your action has been completed successfully.",
        features: [
          "Everything is working as expected",
          "You can continue using the application",
          "All changes have been saved",
        ],
        actions: [
          {
            label: "Continue",
            href: "/",
            variant: "default" as const,
          },
        ],
      };
  }
};

export const AuthSuccess = ({
  type = "generic",
  role,
  title,
  description,
  features,
  actions,
}: AuthSuccessProps) => {
  const defaultConfig = getDefaultSuccessConfig(type, role);
  const finalTitle = title || defaultConfig.title;
  const finalDescription = description || defaultConfig.description;
  const finalFeatures = features || defaultConfig.features;
  const finalActions = actions || defaultConfig.actions;

  const handleActionClick = (action: AuthSuccessAction) => {
    if (action.onClick) {
      action.onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: AuthSuccessAction) => {
    if (e.key === "Enter") {
      handleActionClick(action);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-center">
        {/* Square template holder for future component */}
        <div className="size-32 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center">
          <CheckCircle2 className="size-10 text-green-500" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-medium font-display text-center">
          {finalTitle}
        </h1>

        <div className="grid gap-2 items-center justify-center">
          <p className="text-muted-foreground text-center max-w-md">
            {finalDescription}
          </p>

          <div className="grid gap-1 items-center justify-center mt-4">
            {finalFeatures.map((feature: string, index: number) => (
              <SuccessItem key={index} text={feature} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        {finalActions.map((action: AuthSuccessAction, index: number) =>
          action.href ? (
            <Link key={index} to={action.href}>
              <Button
                type="button"
                // size="sm"
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

        {/* <p className="text-xs text-center text-muted-foreground">
          Need help? Contact your IT team
        </p> */}
      </div>
    </div>
  );
};
