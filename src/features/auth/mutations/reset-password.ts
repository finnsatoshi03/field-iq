import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authService } from "@/services/auth-service";

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

// Utility functions for resend timer
const getResendKey = (email: string) => `reset-password-resend-${email}`;
const getResendTimestamp = (email: string): number | null => {
  const stored = localStorage.getItem(getResendKey(email));
  return stored ? parseInt(stored, 10) : null;
};
const setResendTimestamp = (email: string, timestamp: number) => {
  localStorage.setItem(getResendKey(email), timestamp.toString());
};
const clearResendTimestamp = (email: string) => {
  localStorage.removeItem(getResendKey(email));
};

export const useCanResend = (email: string, cooldownMinutes: number = 1) => {
  const lastSent = getResendTimestamp(email);
  if (!lastSent) return true;

  const now = Date.now();
  const cooldownMs = cooldownMinutes * 60 * 1000;
  return now - lastSent >= cooldownMs;
};

export const getTimeUntilResend = (
  email: string,
  cooldownMinutes: number = 1,
): number => {
  const lastSent = getResendTimestamp(email);
  if (!lastSent) return 0;

  const now = Date.now();
  const cooldownMs = cooldownMinutes * 60 * 1000;
  const timeLeft = cooldownMs - (now - lastSent);
  return Math.max(0, Math.ceil(timeLeft / 1000));
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async ({ email }: ForgotPasswordData) => {
      const promise = authService.resetPassword(email);

      // Set timestamp when starting the request
      setResendTimestamp(email, Date.now());

      // Wrap with toast.promise
      return toast.promise(promise, {
        loading: "Sending reset instructions...",
        success:
          "Reset instructions sent! Check your email and click the link to reset your password.",
        error: (error: Error) => {
          // Clear timestamp on error
          clearResendTimestamp(email);
          return `Failed to send reset instructions: ${error.message}`;
        },
      });
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ password, confirmPassword }: ResetPasswordData) => {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const promise = authService.updatePassword(password);

      return toast.promise(promise, {
        loading: "Updating your password...",
        success:
          "Password updated successfully! You can now sign in with your new password.",
        error: (error: Error) => `Failed to update password: ${error.message}`,
      });
    },
    onSuccess: () => {
      // Sign out the user after successful password update
      authService.signOut();
    },
  });
};

export const useInvitePasswordSetup = () => {
  return useMutation({
    mutationFn: async ({ password, confirmPassword }: ResetPasswordData) => {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const promise = authService.updatePassword(password);

      return toast.promise(promise, {
        loading: "Setting up your account...",
        success: "Account setup complete! Welcome to the platform!",
        error: (error: Error) => `Failed to setup account: ${error.message}`,
      });
    },
    // Don't sign out for invite flow - let the component handle the next steps
  });
};
