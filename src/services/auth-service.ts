import { supabase } from "@/lib/supabase";

export interface SignInData {
  email: string;
  password: string;
}

export interface SignInResponse {
  user: any;
  session: any;
}

export const authService = {
  async signIn({ email, password }: SignInData): Promise<SignInResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return {
      user: data.user,
      session: data.session,
    };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },

  async resetPassword(email: string) {
    let { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      throw error;
    }
    return data;
  },

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      throw error;
    }
    return data;
  },

  async getUserProfileById(userId: string) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("identity_id", userId);
    if (error) {
      throw error;
    }
    return data;
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      throw error;
    }
    return user;
  },

  async getCurrentSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return session;
  },

  async setSession({
    access_token,
    refresh_token,
  }: {
    access_token: string;
    refresh_token: string;
  }) {
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) {
      throw error;
    }
    return { data, error };
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
