import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { getDefaultDashboardRoute } from "@/lib/rbac";
import { authService, type SignInData } from "@/services/auth-service";
import { transformSupabaseUser, useUserStore } from "@/store/user-store";

export const useSignIn = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, setLoading } = useUserStore();

  const mutation = useMutation({
    mutationFn: (data: SignInData) => authService.signIn(data),
    onMutate: () => {
      // Set loading state
      setLoading(true);
    },
    onSuccess: async (data) => {
      // Get user profile data from the database
      const userProfileData = await authService.getUserProfileById(
        data.user.id,
      );

      // Transform and store user in Zustand with merged profile data
      const userProfile = transformSupabaseUser(
        data.user,
        userProfileData?.[0],
      );
      setUser(userProfile);

      // Cache the user data in React Query
      queryClient.setQueryData(["auth", "user"], data.user);
      queryClient.setQueryData(["auth", "session"], data.session);
      queryClient.setQueryData(["auth", "profile"], userProfileData);

      // Navigate to appropriate dashboard based on role
      const defaultRoute = getDefaultDashboardRoute(userProfile.role);
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
