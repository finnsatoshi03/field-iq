import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { authService } from "@/services/auth-service";
import { useUserStore } from "@/store/user-store";

export const useSignOut = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { signOut } = useUserStore();

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      // Clear user from Zustand store
      signOut();

      // Clear all auth-related queries from React Query
      queryClient.removeQueries({ queryKey: ["auth"] });

      // Clear all queries (optional - for complete cleanup)
      queryClient.clear();

      // Show success message
      toast.success("Signed out successfully");

      // Navigate to sign-in page
      navigate({ to: "/auth/sign-in" });
    },
    onError: (error: any) => {
      // Show error message
      toast.error(error.message || "Sign out failed");
      console.error("Sign out failed:", error);
    },
  });
};
