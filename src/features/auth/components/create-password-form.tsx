import { Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { CircleCheck, Eye, EyeOff, XCircle } from "lucide-react";

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
        "Password must contain at least one special character"
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
          <CircleCheck className="size-6 text-green-500 animate-in zoom-in-50 duration-200" />
        ) : (
          <XCircle className="size-6 text-red-500" />
        )}
      </div>
      <p className="px-4 py-1.5 rounded bg-accent text-accent-foreground font-medium text-sm leading-relaxed">
        {text}
      </p>
    </div>
  );
};

interface CreatePasswordFormProps {
  onSuccess?: () => void;
}

export function CreatePasswordForm({ onSuccess }: CreatePasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = form.watch("password");

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Simulate API call
      console.log(values);
      // On successful password creation, call the parent callback
      onSuccess?.();
    } catch (error) {
      console.error("Error creating password:", error);
    }
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
              <FormLabel className="font-bold">Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
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

        <div className="grid gap-2">
          <Button type="submit" className="w-full">
            Create Password
          </Button>
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
            Already have an account? Sign in to continue
          </p>
        </div>
      </form>
    </Form>
  );
}
