import { supabaseAdmin } from "@/lib/supabase";

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata: {
    name?: string;
    role?: string;
    first_name?: string;
    last_name?: string;
    farm_name?: string;
    mobile_number?: string;
    location?: string;
    region?: string;
    livestock_type?: string;
    created_by?: string;
  };
  email_confirmed_at: string | null;
}

export type EmailLinkType =
  | "signup"
  | "invite"
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

export interface InviteUserParams {
  email: string;
  options?: {
    data?: Record<string, any>; // Custom user metadata
    redirectTo?: string; // Redirect URL
  };
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

  // Get users by company_id (requires admin privileges)
  async getUsersByCompanyId(companyId: number | null): Promise<AdminUser[]> {
    if (!companyId) {
      return [];
    }

    // First get all users from Supabase Auth
    const { data: authUsers, error: authError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      throw authError;
    }

    // Get user profiles for the specific company
    const { data: userProfiles, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("identity_id")
      .eq("company_id", companyId);

    if (profileError) {
      throw profileError;
    }

    // Create a set of user IDs that belong to this company
    const companyUserIds = new Set(
      userProfiles?.map((profile) => profile.identity_id) || [],
    );

    // Filter auth users to only include those in the company
    const companyUsers = authUsers.users.filter((user) =>
      companyUserIds.has(user.id),
    );

    return companyUsers as AdminUser[];
  },

  // Get farmers by assigned sales rep user profile ID using company_farmers table (requires admin privileges)
  async getFarmersByAssignedSalesRep(
    salesRepUserProfileId: number | null,
  ): Promise<AdminUser[]> {
    if (!salesRepUserProfileId) {
      return [];
    }

    // First get all users from Supabase Auth
    const { data: authUsers, error: authError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      throw authError;
    }

    // Get company farmers assigned to the specific sales rep
    const { data: companyFarmersData, error: companyFarmersError } =
      await supabaseAdmin
        .from("company_farmers")
        .select("farmer_user_profile_id")
        .eq("assigned_sales_rep_user_profile_id", salesRepUserProfileId);

    if (companyFarmersError) {
      throw companyFarmersError;
    }

    // Get user profiles for the farmer IDs
    const farmerProfileIds =
      companyFarmersData?.map((cf) => cf.farmer_user_profile_id) || [];

    if (farmerProfileIds.length === 0) {
      return [];
    }

    const { data: userProfiles, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("identity_id")
      .in("id", farmerProfileIds);

    if (profileError) {
      throw profileError;
    }

    // Create a set of farmer user IDs that are assigned to this sales rep
    const assignedFarmerIds = new Set(
      userProfiles?.map((profile) => profile.identity_id) || [],
    );

    // Filter auth users to only include farmers assigned to this sales rep
    const filteredFarmers = authUsers.users.filter(
      (user) =>
        assignedFarmerIds.has(user.id) && user.user_metadata?.role === "farmer",
    );

    return filteredFarmers as AdminUser[];
  },

  // Get farmers by company_id using company_farmers table (requires admin privileges)
  async getFarmersByCompanyId(companyId: number | null): Promise<AdminUser[]> {
    if (!companyId) {
      return [];
    }

    // First get all users from Supabase Auth
    const { data: authUsers, error: authError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      throw authError;
    }

    // Get company farmers for the specific company
    const { data: companyFarmersData, error: companyFarmersError } =
      await supabaseAdmin
        .from("company_farmers")
        .select("farmer_user_profile_id")
        .eq("company_id", companyId);

    if (companyFarmersError) {
      throw companyFarmersError;
    }

    // Get user profiles for the farmer IDs
    const farmerProfileIds =
      companyFarmersData?.map((cf) => cf.farmer_user_profile_id) || [];

    if (farmerProfileIds.length === 0) {
      return [];
    }

    const { data: userProfiles, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("identity_id")
      .in("id", farmerProfileIds);

    if (profileError) {
      throw profileError;
    }

    // Create a set of farmer user IDs that belong to this company
    const companyFarmerIds = new Set(
      userProfiles?.map((profile) => profile.identity_id) || [],
    );

    // Filter auth users to only include farmers in the company
    const filteredFarmers = authUsers.users.filter(
      (user) =>
        companyFarmerIds.has(user.id) && user.user_metadata?.role === "farmer",
    );

    return filteredFarmers as AdminUser[];
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
    params: GenerateEmailLinkParams,
  ): Promise<GenerateEmailLinkResponse> {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink(
      params as any,
    );

    if (error) {
      throw error;
    }

    return data;
  },

  // Invite user by email (sends invite link)
  async inviteUserByEmail(
    params: InviteUserParams,
  ): Promise<{ data: any; error: any }> {
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      params.email,
      params.options,
    );

    return { data, error };
  },

  // Update user metadata
  async updateUser(
    userId: string,
    updates: {
      email?: string;
      user_metadata?: Record<string, any>;
      app_metadata?: Record<string, any>;
    },
  ): Promise<AdminUser> {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      updates,
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

  // Assign farmer to sales rep in company_farmers table
  async assignFarmerToSalesRep(params: {
    companyId: number;
    farmerUserProfileId: number;
    assignedSalesRepUserProfileId: number;
  }): Promise<void> {
    const { error } = await supabaseAdmin.from("company_farmers").insert({
      company_id: params.companyId,
      farmer_user_profile_id: params.farmerUserProfileId,
      assigned_sales_rep_user_profile_id: params.assignedSalesRepUserProfileId,
    });

    if (error) {
      throw error;
    }
  },

  // Get user profile ID by identity ID
  async getUserProfileIdByIdentityId(
    identityId: string,
  ): Promise<number | null> {
    const { data, error } = await supabaseAdmin
      .from("user_profiles")
      .select("id")
      .eq("identity_id", identityId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      throw error;
    }

    return data?.id || null;
  },
};
