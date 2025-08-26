// Farmer V2 API Types

// Chat AI Types
export interface ChatAiRequest {
  prompt: string;
  user_id: number;
  chat_id: number;
  intent_id: number;
  ticket_id: string;
}

export interface ChatAiResponse {
  response: string;
  chat_id: number;
  intent_id: number;
  ticket_id: string;
  timestamp: string;
}

// Feed Programs Types
export interface CreateFeedProgramRequest {
  farmer_user_profile_id: number;
  feed_product_id: number;
  animal_quantity: number;
  switch_reason?: string;
  notes?: string;
}

export interface CreateFeedProgramResponse {
  id: number;
  farmer_user_profile_id: number;
  feed_product_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FeedProgram {
  id: number;
  farmer_user_profile_id: number;
  feed_product_id: number;
  animal_quantity: number;
  status: "active" | "completed" | "incomplete";
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface ActiveFeedProgramResponse {
  data: FeedProgram | null;
}

export interface FeedProduct {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface ActiveFeedProductData {
  feed_program_id: number;
  feed_name: string;
  status: "active" | "completed" | "incomplete";
  feed_stage: string;
  age_range_start: number;
  age_range_end: number;
  feed_goal: string;
  days_on_feed: number;
}

export interface ActiveFeedProductResponse {
  message: string;
  data: ActiveFeedProductData | null;
}

export interface CompleteFeedProgramResponse {
  success: boolean;
  message: string;
  feed_program: FeedProgram;
}

export interface IncompleteFeedProgramResponse {
  success: boolean;
  message: string;
  feed_program: FeedProgram;
}

// Growth Performance Types
export interface GrowthPerformanceAnalytics {
  total_logs: number;
  total_weight_kg: number;
  mortality_count: number;
  mortality_percentage: number;
  performance_index: number;
  recent_records: any[]; // Define more specific type if needed
}

export interface GrowthPerformanceData {
  daily_average_growth_rate: number;
  current_fcr: number;
  actual_weight: number;
  target_weight: number;
  growth_chart_data: any[]; // Define more specific type if needed
  performance_analytics: GrowthPerformanceAnalytics;
}

export interface GrowthPerformanceResponse {
  message: string;
  data: GrowthPerformanceData;
}

// Feed Calculation Log Types
export interface FeedCalculationLogData {
  id: number;
  user_profile_id: number;
  number_of_animals: number;
  feed_frequency: number;
  bag_size_kg: number;
  current_stock_bags: number;
  bag_cost_php: number;
  animal_type: string;
  feed_stage: string;
  daily_consumption_kg: number;
  bags_needed_per_week: number;
  cost_per_week_php: number;
  reorder_point_days: number;
  alert_level: string;
  weekly_consumption_kg: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFeedCalculationLogRequest {
  user_profile_id: number;
  number_of_animals: number;
  feed_frequency: number;
  bag_size_kg: number;
  current_stock_bags: number;
  bag_cost_php: number;
  animal_type: string;
  feed_stage: string;
  daily_consumption_kg: number;
  bags_needed_per_week: number;
  cost_per_week_php: number;
  reorder_point_days: number;
  alert_level: string;
  weekly_consumption_kg: number;
}

export interface UpdateFeedCalculationLogRequest {
  id: number;
  user_profile_id: number;
  number_of_animals: number;
  feed_frequency: number;
  bag_size_kg: number;
  current_stock_bags: number;
  bag_cost_php: number;
  animal_type: string;
  feed_stage: string;
  daily_consumption_kg: number;
  bags_needed_per_week: number;
  cost_per_week_php: number;
  reorder_point_days: number;
  alert_level: string;
  weekly_consumption_kg: number;
  created_at: string;
  updated_at: string; // Note: API has typo "update_at" instead of "updated_at"
}

export interface FeedCalculationLogResponse {
  message: string;
  data: FeedCalculationLogData;
}
