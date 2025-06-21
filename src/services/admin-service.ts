import { supabaseAdmin } from "@/lib/supabase";

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata: {
    name?: string;
    role?: string;
  };
  email_confirmed_at: string | null;
}

export type EmailLinkType =
  | "signup"
  | "invite"
  | "magiclink"
  | "recovery"
  | "email_change_current"
  | "email_change_new"
  | "phone_change";

export interface GenerateEmailLinkParams {
  type: EmailLinkType;
  email: string;
  password?: string; // Required for signup
  newEmail?: string; // Required for email_change_current or email_change_new
  options?: {
    data?: Record<string, any>; // Custom user metadata
    redirectTo?: string; // Redirect URL
  };
}

export interface GenerateEmailLinkResponse {
  user?: any;
  email_otp?: string;
  phone_otp?: string;
  action_link?: string;
  hashed_token?: string;
  verification_type?: string;
  redirect_to?: string;
}

export const adminService = {
  // Get all users (requires admin privileges)
  async getUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      throw error;
    }

    return data.users as AdminUser[];
  },

  // Get user by ID
  async getUserById(userId: string): Promise<AdminUser> {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) {
      throw error;
    }

    return data.user as AdminUser;
  },

  // Delete user
  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      throw error;
    }
  },

  // Generate email link
  async generateEmailLink(
    params: GenerateEmailLinkParams
  ): Promise<GenerateEmailLinkResponse> {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink(
      params as any
    );

    if (error) {
      throw error;
    }

    return data;
  },

  // Update user metadata
  async updateUser(
    userId: string,
    updates: {
      email?: string;
      user_metadata?: Record<string, any>;
      app_metadata?: Record<string, any>;
    }
  ): Promise<AdminUser> {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      updates
    );

    if (error) {
      throw error;
    }

    return data.user as AdminUser;
  },

  // Create user
  async createUser(params: {
    email: string;
    password: string;
    user_metadata?: Record<string, any>;
    email_confirm?: boolean;
  }): Promise<AdminUser> {
    const { data, error } = await supabaseAdmin.auth.admin.createUser(params);

    if (error) {
      throw error;
    }

    return data.user as AdminUser;
  },
};
