import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Eye, EyeOff, XCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useInvitePasswordSetup,
  useResetPassword,
} from "@/features/auth/mutations/reset-password";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface RequirementItemProps {
  isValid: boolean;
  text: string;
}

const RequirementItem = ({ isValid, text }: RequirementItemProps) => {
  return (
    <div className="flex items-center gap-1">
      <div className="transition-all duration-300 ease-in-out">
        {isValid ? (
          <CircleCheck className="size-5 text-green-500 animate-in zoom-in-50 duration-200" />
        ) : (
          <XCircle className="size-5 text-red-500" />
        )}
      </div>
      <p className="px-3 py-1 rounded bg-accent text-accent-foreground font-medium text-xs leading-relaxed">
        {text}
      </p>
    </div>
  );
};

interface UpdatePasswordAlertDialogProps {
  open: boolean;
  onComplete: () => void;
  userEmail?: string;
  type?: "invite" | "reset";
}

export const UpdatePasswordAlertDialog = ({
  open,
  onComplete,
  userEmail,
  type = "invite",
}: UpdatePasswordAlertDialogProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const invitePasswordMutation = useInvitePasswordSetup();
  const resetPasswordMutation = useResetPassword();

  // Use the appropriate mutation based on type
  const passwordMutation =
    type === "invite" ? invitePasswordMutation : resetPasswordMutation;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = (form.watch("password") ?? "") as string;

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    passwordMutation.mutate(
      {
        password: values.password,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          // Shorter delay for invite flow since route handles the main timing
          const delay = type === "invite" ? 500 : 1500;
          setTimeout(() => {
            onComplete();
          }, delay);
        },
      },
    );
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Password requirement validators
  const requirements = [
    {
      text: "At least 8 characters",
      isValid: passwordValue.length >= 8,
    },
    {
      text: "Numbers and letters",
      isValid: /[0-9]/.test(passwordValue) && /[a-zA-Z]/.test(passwordValue),
    },
    {
      text: "One special character (!@#$%^&*)",
      isValid: /[!@#$%^&*]/.test(passwordValue),
    },
  ];

  // Dynamic content based on type
  const getTitle = () => {
    return type === "invite"
      ? "Welcome! Set Your Password"
      : "Reset Your Password";
  };

  const getDescription = () => {
    if (type === "invite") {
      return userEmail ? (
        <>
          You've been invited to join as <strong>{userEmail}</strong>. To
          complete your account setup, please create a secure password.
        </>
      ) : (
        "To complete your account setup, please create a secure password. This is required before you can access the application."
      );
    } else {
      return userEmail ? (
        <>
          Hello <strong>{userEmail}</strong>, please enter your new password
          below. This will replace your current password and be used to sign in
          to your account.
        </>
      ) : (
        "Please enter your new password below. This will replace your current password and be used to sign in to your account."
      );
    }
  };

  const getButtonText = () => {
    if (passwordMutation.isPending) {
      return type === "invite"
        ? "Setting Up Account..."
        : "Updating Password...";
    }
    return type === "invite" ? "Complete Setup" : "Update Password";
  };

  const getLabelText = () => {
    return type === "invite" ? "Create Password" : "New Password";
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-xl">
            {getTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">{getLabelText()}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          type === "invite"
                            ? "Enter your password"
                            : "Enter your new password"
                        }
                        {...field}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={handleTogglePassword}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        tabIndex={0}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    {type === "invite"
                      ? "Confirm Password"
                      : "Confirm New Password"}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={
                          type === "invite"
                            ? "Confirm your password"
                            : "Confirm your new password"
                        }
                        {...field}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={handleToggleConfirmPassword}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        tabIndex={0}
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-1">
              {requirements.map((requirement, index) => (
                <RequirementItem
                  key={index}
                  isValid={requirement.isValid}
                  text={requirement.text}
                />
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={passwordMutation.isPending}
                className="w-full"
              >
                {getButtonText()}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
