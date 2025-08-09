import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { getDefaultDashboardRoute } from "@/lib/rbac";
import { authService, type SignInData } from "@/services/auth-service";
import { useUserStore } from "@/store/user-store";

export const useSignIn = () => {
  const navigate = useNavigate();
  const { setLoading } = useUserStore();

  const mutation = useMutation({
    mutationFn: (data: SignInData) => authService.signIn(data),
    onMutate: () => {
      // Set loading state
      setLoading(true);
    },
    onSuccess: async (data) => {
      // Simply navigate based on role from auth payload; route layout will initialize user/profile
      const role = (data.user as any)?.user_metadata?.role || "sales_rep";
      const defaultRoute = getDefaultDashboardRoute(role);
      navigate({ to: defaultRoute });
    },
    onError: (error: any) => {
      console.error("Sign in failed:", error);
    },
    onSettled: () => {
      // Clear loading state
      setLoading(false);
    },
  });

  // Return a wrapped mutation that includes toast.promise
  return {
    ...mutation,
    mutate: (data: SignInData) => {
      const signInPromise = mutation.mutateAsync(data);

      toast.promise(signInPromise, {
        loading: "Signing in...",
        success: "Successfully signed in!",
        error: (error: any) => {
          console.error("Sign in failed:", error);
          return (
            error.message || "Failed to sign in. Please check your credentials."
          );
        },
      });
    },
  };
};
