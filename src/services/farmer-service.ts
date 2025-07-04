export interface FarmerData {
  used_feed: {
    feed_product_id: number;
    feed_name: string;
    feed_stage: string;
    feed_goal: string;
    age_range_start: number;
    age_range_end: number;
    start_date: string;
  };
  growth_performance: {
    daily_average_growth_rate: number;
    current_fcr: number;
    actual_weight: number;
    target_weight: number;
    growth_chart_data: Array<{
      date: string;
      actual_weight: number;
      target_weight: number;
    }>;
    performance_analytics: {
      total_logs: number;
      total_weight_kg: number;
      mortality_count: number;
      mortality_percentage: number;
      performance_index: number;
      recent_records: Array<{
        date: string;
        day: string;
        actual_weight: number;
        note: string;
      }>;
    };
  };
  feed_calculation_log: {
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
    weekly_consumption_kg: number;
    bags_needed_per_week: number;
    cost_per_week_php: number;
    reorder_point_days: number;
    alert_level: "low" | "medium" | "high" | "good";
    created_at: string;
    updated_at: string;
  };
  feed_intake_behavior: {
    behavior_score: number;
    behavior_status: "eating_well" | "picky" | "not_eating";
    summary: {
      eating_well: number;
      picky: number;
      not_eating: number;
    };
    recent_feed_records: Array<{
      date: string;
      feed_intake_status: "eating_well" | "picky" | "not_eating";
      feed_intake_kg: number;
    }>;
  };
  health_watch: {
    health_score: number;
    issue_summary: {
      sick: number;
      mortality: number;
      notes: number;
    };
    recent_issues: Array<{
      date: string;
      incident_type:
        | "mortality"
        | "sickness"
        | "feed_rejection"
        | "growth_issue";
      affected_count: number;
      symptoms: string;
      suspected_cause: string;
      requires_vet_visit: boolean;
      feed_info: string | null;
      actions_taken: string;
    }>;
  };
}

export const getFarmerData = async (): Promise<FarmerData> => {
  
  const response = await fetch('http://127.0.0.1:8000/ViewModels/farmer-dashboard/3');
  if (!response.ok) {
    throw new Error('Failed to fetch farmer data');
  }
  const data: FarmerData = await response.json();
  return data;
};
