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

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
