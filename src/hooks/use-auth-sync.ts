import { authService } from "@/services/auth-service";
import { transformSupabaseUser, useUserStore } from "@/store/user-store";
import { useEffect, useState } from "react";

export const useAuthSync = () => {
  const { user, setUser, isAuthenticated } = useUserStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const syncAuthState = async () => {
      try {
        // Get current user from Supabase
        const supabaseUser = await authService.getCurrentUser();

        if (supabaseUser) {
          // Get user profile data
          const userProfileData = await authService.getUserProfileById(
            supabaseUser.id,
          );

          // Transform and set user in store
          const userProfile = transformSupabaseUser(
            supabaseUser,
            userProfileData?.[0],
          );

          setUser(userProfile);
        } else {
          // Only clear if we don't have a user in store already
          if (user) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Failed to sync auth state:", error);
        // Only clear user on error if we don't have a user in store already
        if (user) {
          setUser(null);
        }
      } finally {
        setIsInitialized(true);
      }
    };

    // Only sync if user is not already set
    if (!user) {
      syncAuthState();
    } else {
      setIsInitialized(true);
    }
  }, []); // Only run once on mount

  return { isInitialized, user, isAuthenticated };
};
