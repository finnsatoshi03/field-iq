// Sales Rep API Response Types

export interface MonthlySalesData {
  month: string;
  volumeInfluenced: number;
  closedSales: number;
}

export interface MonthlySalesResponse {
  message: string;
  data: {
    monthly_sales: MonthlySalesData[];
    average_sales: number;
  };
}

// Sales Rep Logs Types
export interface SalesRepLog {
  id: number;
  type: "warning" | "success" | "error" | "info";
  title: string;
  description: string | null;
  timestamp: string;
}

export interface SalesRepLogsResponse {
  message: string;
  data: {
    data: SalesRepLog[];
  };
}

// Farms Types
export interface Farm {
  farm_name: string | null;
  location: string;
  visit_type: "planned_visit" | "completed_visit" | "overdue";
  visit_date: string;
  visit_time: string;
}

export interface FarmsResponse {
  message: string;
  data: {
    farms: Farm[];
    planned_count: number;
    completed_count: number;
  };
}
