import { supabase } from "@/lib/supabase";

export interface DevSignUpData {
  email: string;
  password: string;
  name: string;
}

export const devSignUpService = {
  async signUp({ email, password, name }: DevSignUpData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: "dev",
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  },
};
