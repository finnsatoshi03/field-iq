import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@supabase/supabase-js";
import type { UserRole } from "@/lib/types";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  avatar_url: string | null;
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
    }
  )
);

// Helper function to transform Supabase User to UserProfile
export const transformSupabaseUser = (user: User): UserProfile => ({
  id: user.id,
  email: user.email || "",
  name: user.user_metadata?.name || user.email?.split("@")[0] || null,
  role: user.user_metadata?.role || "sales_rep",
  isEmailVerified: user.email_confirmed_at !== null,
  avatar_url: user.user_metadata?.avatar_url || null,
});
