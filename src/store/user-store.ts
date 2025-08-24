import type { UserRole } from "@/lib/types";
import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string; // identity_id from Supabase
  profileId: number | null; // id from user profile table
  email: string;
  name: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  avatar_url: string | null;
  // Additional fields from user profile
  first_name: string | null;
  last_name: string | null;
  mobile_number: string | null;
  profile_picture_url: string | null;
  company_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  // Farmer-specific fields from user_metadata
  livestock_type: string | null;
  location: string | null;
  region: string | null;
  // Sales rep region for territory management
  territory_region: string | null;
}

interface UserState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  forceRefresh: () => void;
  clearPersistedState: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      signOut: () => {
        // Clear the persisted storage completely
        try {
          localStorage.removeItem("user-store");
        } catch (error) {
          console.warn("Failed to clear localStorage:", error);
        }
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      forceRefresh: () => {
        // Force a refresh by clearing the user data
        // This will trigger the useEffect in the authenticated route to refetch
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      clearPersistedState: () => {
        // Completely clear the persisted storage and reset state
        try {
          localStorage.removeItem("user-store");
        } catch (error) {
          console.warn("Failed to clear localStorage:", error);
        }
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Clear storage version to force refresh with new fields
      version: 1,
    },
  ),
);

// Helper function to transform Supabase User to UserProfile
export const transformSupabaseUser = (
  user: User,
  profileData?: any,
): UserProfile => {
  return {
    id: user.id,
    profileId: profileData?.id || null,
    email: user.email || "",
    name: user.user_metadata?.name || user.email?.split("@")[0] || null,
    role: user.user_metadata?.role || "sales_rep",
    isEmailVerified: user.email_confirmed_at !== null,
    avatar_url: user.user_metadata?.avatar_url || null,
    // Profile data fields
    first_name:
      profileData?.first_name || user.user_metadata?.first_name || null,
    last_name: profileData?.last_name || user.user_metadata?.last_name || null,
    mobile_number:
      profileData?.mobile_number || user.user_metadata?.mobile_number || null,
    profile_picture_url: profileData?.profile_picture_url || null,
    company_id: profileData?.company_id || null,
    created_at: profileData?.created_at || null,
    updated_at: profileData?.updated_at || null,
    // Farmer-specific fields from user_metadata
    livestock_type: user.user_metadata?.livestock_type || null,
    location: user.user_metadata?.location || null,
    region: user.user_metadata?.region || null,
    // Sales rep territory region
    territory_region: user.user_metadata?.region || null,
  };
};
