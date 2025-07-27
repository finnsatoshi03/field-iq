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

      signOut: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Helper function to transform Supabase User to UserProfile
export const transformSupabaseUser = (
  user: User,
  profileData?: any,
): UserProfile => ({
  id: user.id,
  profileId: profileData?.id || null,
  email: user.email || "",
  name: user.user_metadata?.name || user.email?.split("@")[0] || null,
  role: user.user_metadata?.role || "sales_rep",
  isEmailVerified: user.email_confirmed_at !== null,
  avatar_url: user.user_metadata?.avatar_url || null,
  // Profile data fields
  first_name: profileData?.first_name || null,
  last_name: profileData?.last_name || null,
  mobile_number: profileData?.mobile_number || null,
  profile_picture_url: profileData?.profile_picture_url || null,
  company_id: profileData?.company_id || null,
  created_at: profileData?.created_at || null,
  updated_at: profileData?.updated_at || null,
});
