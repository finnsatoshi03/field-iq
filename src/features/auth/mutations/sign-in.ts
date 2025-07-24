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

  return useMutation({
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
