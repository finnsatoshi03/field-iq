// Farmer Dashboard API Response Types

export interface UsedFeed {
  feed_product_id: number;
  feed_name: string;
  feed_stage: string;
  feed_goal: string;
  age_range_start: number;
  age_range_end: number;
  start_date: string;
}

export interface GrowthChartData {
  date: string;
  actual_weight: number;
  target_weight: number;
}

export interface RecentRecord {
  date: string;
  day: string;
  actual_weight: number;
  note: string;
}

export interface PerformanceAnalytics {
  total_logs: number;
  total_weight_kg: number;
  mortality_count: number;
  mortality_percentage: number;
  performance_index: number;
  recent_records: RecentRecord[];
}

export interface GrowthPerformance {
  daily_average_growth_rate: number;
  current_fcr: number;
  actual_weight: number;
  target_weight: number;
  growth_chart_data: GrowthChartData[];
  performance_analytics: PerformanceAnalytics;
}

export interface FeedCalculationLog {
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
  created_at: string;
  updated_at: string;
  weekly_consumption_kg: number;
}

export interface FeedIntakeRecord {
  date: string;
  feed_intake_status: string;
  feed_intake_kg: number;
}

export interface FeedIntakeBehavior {
  behavior_score: number;
  behavior_status: string;
  summary: {
    eating_well: number;
    picky: number;
    not_eating: number;
  };
  recent_feed_records: FeedIntakeRecord[];
}

export interface HealthIssue {
  date: string;
  incident_type: string;
  affected_count: number;
  symptoms: string;
  suspected_cause: string;
  requires_vet_visit: boolean;
  feed_info: any; // nullable
  actions_taken: string;
}

export interface HealthWatch {
  health_score: number;
  issue_summary: {
    sick: number;
    mortality: number;
    notes: number;
  };
  recent_issues: HealthIssue[];
}

// Main Dashboard Response Type
export interface FarmerDashboardData {
  used_feed: UsedFeed;
  growth_performance: GrowthPerformance;
  feed_calculation_log: FeedCalculationLog;
  feed_intake_behavior: FeedIntakeBehavior;
  health_watch: HealthWatch;
}

// Feed stages mapping for UI
export const FEED_STAGE_DISPLAY: Record<string, string> = {
  pre_starter: "Pre-Starter",
  starter: "Starter",
  grower: "Grower",
  finisher: "Finisher",
  developer: "Developer",
  layer: "Layer",
};

// Feed stage colors for badges
export const FEED_STAGE_COLORS: Record<string, string> = {
  pre_starter: "bg-blue-100 text-blue-800 border-blue-200",
  starter: "bg-green-100 text-green-800 border-green-200",
  grower: "bg-yellow-100 text-yellow-800 border-yellow-200",
  finisher: "bg-orange-100 text-orange-800 border-orange-200",
  developer: "bg-purple-100 text-purple-800 border-purple-200",
  layer: "bg-pink-100 text-pink-800 border-pink-200",
};

// Behavior status colors
export const BEHAVIOR_STATUS_COLORS: Record<string, string> = {
  eating_well: "bg-green-100 text-green-800 border-green-200",
  picky: "bg-yellow-100 text-yellow-800 border-yellow-200",
  not_eating: "bg-red-100 text-red-800 border-red-200",
};

// Alert level colors
export const ALERT_LEVEL_COLORS: Record<string, string> = {
  low: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-green-100 text-green-800 border-green-200",
};
