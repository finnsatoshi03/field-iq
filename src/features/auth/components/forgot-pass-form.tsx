import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  getTimeUntilResend,
  useCanResend,
  useForgotPassword,
} from "@/features/auth/mutations/reset-password";
import { Link } from "@tanstack/react-router";

const formSchema = z.object({
  email: z.string().email(),
});

export function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const watchedEmail = form.watch("email");

  // Use submitted email for timer checks if available, otherwise use current input
  const emailForTimer = submittedEmail || watchedEmail;
  const canResend = useCanResend(emailForTimer);

  // Update timer every second
  useEffect(() => {
    if (!canResend && emailForTimer) {
      const updateTimer = () => {
        const remaining = getTimeUntilResend(emailForTimer);
        setTimeLeft(remaining);
        if (remaining > 0) {
          setTimeout(updateTimer, 1000);
        }
      };
      updateTimer();
    }
  }, [canResend, emailForTimer]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    forgotPasswordMutation.mutate(values, {
      onSuccess: () => {
        setSubmittedEmail(values.email);
        // Don't reset the form to avoid timer confusion
      },
    });
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Check if current email matches submitted email (for resend scenario)
  const isResendingToSameEmail =
    submittedEmail && watchedEmail === submittedEmail;
  const showResendTimer = !canResend && emailForTimer.length > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Email</FormLabel>
              <FormControl>
                <Input placeholder="Input your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={forgotPasswordMutation.isPending || showResendTimer}
          >
            {forgotPasswordMutation.isPending
              ? "Sending..."
              : showResendTimer
                ? `Resend in ${formatTime(timeLeft)}`
                : submittedEmail && isResendingToSameEmail
                  ? "Send again"
                  : "Send reset instructions"}
          </Button>

          {submittedEmail && (
            <div className="text-sm text-center text-green-600 bg-green-50 p-3 rounded-md">
              Reset instructions sent to <strong>{submittedEmail}</strong>
              <br />
              Check your email and click the link to reset your password.
              {!isResendingToSameEmail && watchedEmail && (
                <div className="mt-2 text-amber-600">
                  Change email to <strong>{watchedEmail}</strong> and send new
                  instructions?
                </div>
              )}
            </div>
          )}

          <Link to="/auth/sign-in">
            <Button
              type="button"
              size="sm"
              className="w-full bg-muted text-muted-foreground hover:bg-muted/80"
            >
              Back to sign in
            </Button>
          </Link>
          <p className="text-xs text-center text-muted-foreground">
            Remembered your password? Try signing in again
          </p>
        </div>
      </form>
    </Form>
  );
}
