import { supabase } from "@/lib/supabase";

export type FeedStage = string;
export type TargetAnimalType = string;
export type ProductFormat = string;

export interface FeedProduct {
  id: number;
  company_id: number | null;
  name: string;
  product_line: string | null;
  category: string | null;
  feed_stage: FeedStage | null;
  target_animal_type: TargetAnimalType | null;
  age_range_start: number | null;
  age_range_end: number | null;
  product_format: ProductFormat | null;
  is_medicated: boolean | null;
  goal: string | null;
  usp: string | null;
  feeding_instructions: string | null;
  notes: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface GetFeedProductsParams {
  onlyActive?: boolean;
  companyId?: number;
}

export const feedProductService = {
  async getFeedProducts(
    params: GetFeedProductsParams = {},
  ): Promise<FeedProduct[]> {
    let query = supabase.from("feed_products").select("*");

    if (params.onlyActive) {
      query = query.eq("is_active", true);
    }
    if (typeof params.companyId === "number") {
      query = query.eq("company_id", params.companyId);
    }

    query = query.order("name", { ascending: true });

    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return (data ?? []) as FeedProduct[];
  },
};
