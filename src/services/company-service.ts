import { supabase } from "@/lib/supabase";

export interface Company {
  id: number;
  name: string;
  company_type: CompanyType;
  contact_email?: string;
  phone?: string;
  address?: string;
  country: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export type CompanyType = "feed_manufacturer" | "distributor" | "coop";

export interface CreateCompanyParams {
  name: string;
  company_type: CompanyType;
  country: string;
  timezone: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  created_by?: number;
}

export interface UpdateCompanyParams {
  name?: string;
  company_type?: CompanyType;
  country?: string;
  timezone?: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  created_by?: number;
}

export const companyService = {
  // Get company by ID
  async getCompanyById(id: number): Promise<Company> {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data as Company;
  },

  // Get company by user ID
  async getCompanyByUserId(userId: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("identity_id", userId)
      .single();

    if (error) {
      throw error;
    }

    if (!data?.company_id) {
      return null;
    }

    return this.getCompanyById(data.company_id);
  },

  // Create new company
  async createCompany(params: CreateCompanyParams): Promise<Company> {
    const { data, error } = await supabase
      .from("companies")
      .insert([params])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Company;
  },

  // Update company
  async updateCompany(
    id: number,
    params: UpdateCompanyParams,
  ): Promise<Company> {
    const { data, error } = await supabase
      .from("companies")
      .update(params)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Company;
  },

  // Delete company
  async deleteCompany(id: number): Promise<void> {
    const { error } = await supabase.from("companies").delete().eq("id", id);

    if (error) {
      throw error;
    }
  },

  // Get all companies
  async getCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    return data as Company[];
  },
};
