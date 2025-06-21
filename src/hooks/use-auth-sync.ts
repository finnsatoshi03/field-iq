import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import { useUserStore, transformSupabaseUser } from "@/store/user-store";
import { BYPASS_AUTH } from "@/lib/config";

export const useAuthSync = () => {
  const queryClient = useQueryClient();
  const { setUser, setLoading, signOut } = useUserStore();

  useEffect(() => {
    if (BYPASS_AUTH) return;

    let mounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Get current session
        const session = await authService.getCurrentSession();

        if (session?.user && mounted) {
          const userProfile = transformSupabaseUser(session.user);
          setUser(userProfile);

          // Cache in React Query
          queryClient.setQueryData(["auth", "user"], session.user);
          queryClient.setQueryData(["auth", "session"], session);
        } else if (mounted) {
          signOut();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          signOut();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: authListener } = authService.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        switch (event) {
          case "SIGNED_IN":
            if (session?.user) {
              const userProfile = transformSupabaseUser(session.user);
              setUser(userProfile);

              // Update React Query cache
              queryClient.setQueryData(["auth", "user"], session.user);
              queryClient.setQueryData(["auth", "session"], session);
            }
            break;

          case "SIGNED_OUT":
            signOut();
            // Clear React Query cache
            queryClient.removeQueries({ queryKey: ["auth"] });
            break;

          case "TOKEN_REFRESHED":
            if (session?.user) {
              const userProfile = transformSupabaseUser(session.user);
              setUser(userProfile);

              // Update React Query cache
              queryClient.setQueryData(["auth", "user"], session.user);
              queryClient.setQueryData(["auth", "session"], session);
            }
            break;

          default:
            break;
        }
      }
    );

    // Initialize auth state
    initializeAuth();

    // Cleanup function
    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [queryClient, setUser, setLoading, signOut]);
};
