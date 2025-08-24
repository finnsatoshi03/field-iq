import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

// Feed Product types based on the database schema
export interface FeedProduct {
  id: number;
  company_id: number | null;
  name: string | null;
  product_line: string | null;
  category: string | null;
  feed_stage: string | null;
  target_animal_type: string | null;
  age_range_start: number | null;
  age_range_end: number | null;
  product_format: string | null;
  is_medicated: boolean | null;
  goal: string | null;
  usp: string | null;
  feeding_instructions: string | null;
  notes: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string | null;
  default_expected_fcr: number;
}

// Query key factory for feed products
export const feedProductsKeys = {
  all: ["feed-products"] as const,
  active: () => [...feedProductsKeys.all, "active"] as const,
  byCompany: (companyId: number) =>
    [...feedProductsKeys.all, "company", companyId] as const,
};

// Hook for fetching active feed products
export const useFeedProducts = (companyId?: number) => {
  return useQuery({
    queryKey: companyId
      ? feedProductsKeys.byCompany(companyId)
      : feedProductsKeys.active(),
    queryFn: async (): Promise<FeedProduct[]> => {
      let query = supabase
        .from("feed_products")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      // Filter by company if provided
      if (companyId) {
        query = query.eq("company_id", companyId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch feed products: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Hook for fetching a single feed product by ID
export const useFeedProduct = (productId: number) => {
  return useQuery({
    queryKey: [...feedProductsKeys.all, "single", productId],
    queryFn: async (): Promise<FeedProduct | null> => {
      const { data, error } = await supabase
        .from("feed_products")
        .select("*")
        .eq("id", productId)
        .eq("is_active", true)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned
          return null;
        }
        throw new Error(`Failed to fetch feed product: ${error.message}`);
      }

      return data;
    },
    enabled: productId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};
