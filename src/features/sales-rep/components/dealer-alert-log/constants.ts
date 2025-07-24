// Types - Updated to match API responses
export interface Alert {
  id: number;
  type: "warning" | "success" | "error" | "info";
  title: string;
  description: string | null;
  timestamp: string;
}

export interface Farm {
  farm_name: string | null;
  location: string;
  visit_type: "planned_visit" | "completed_visit" | "overdue";
  visit_date: string;
  visit_time: string;
}

// Helper types for mapping API data to UI components
export interface ProcessedFarm {
  name: string;
  location: string;
  status: "visited" | "added" | "overdue";
  datetime: Date;
  visit_type: "planned_visit" | "completed_visit" | "overdue";
}
