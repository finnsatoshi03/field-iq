import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { authService, type SignInData } from "@/services/auth-service";
import { useUserStore, transformSupabaseUser } from "@/store/user-store";
import { getDefaultDashboardRoute } from "@/lib/rbac";

export const useSignIn = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, setLoading } = useUserStore();

  return useMutation({
    mutationFn: (data: SignInData) => authService.signIn(data),
    onMutate: () => {
      // Set loading state
      setLoading(true);
    },
    onSuccess: (data) => {
      // Transform and store user in Zustand
      const userProfile = transformSupabaseUser(data.user);
      setUser(userProfile);

      // Cache the user data in React Query
      queryClient.setQueryData(["auth", "user"], data.user);
      queryClient.setQueryData(["auth", "session"], data.session);

      // Show success message
      toast.success("Sign in successful");

      // Navigate to appropriate dashboard based on role
      const defaultRoute = getDefaultDashboardRoute(userProfile.role);
      navigate({ to: defaultRoute });
    },
    onError: (error: any) => {
      // Show error message
      toast.error(error.message || "Sign in failed");
      console.error("Sign in failed:", error);
    },
    onSettled: () => {
      // Clear loading state
      setLoading(false);
    },
  });
};
