// Admin Sales Types
export interface AdminSalesItem {
  id: string;
  region: string;
  rep: string;
  targetInfluence: number;
  closedSales: number;
  growthRate: number;
  period: string;
}

export interface AdminSalesResponse {
  message: string;
  data: AdminSalesItem[];
}

// Dealer Issues Types
export interface AdminDealerIssueApiItem {
  id: number;
  dealerName: string;
  dealerCode: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    region: string;
  };
  issues: {
    type: string;
    description: string | null;
    reportedDate: string;
    status: "open" | "in-progress" | "resolved";
    priority: "low" | "medium" | "high" | "critical";
  }[];
  severity: "low" | "medium" | "high" | "critical";
  lastUpdated: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface AdminDealerIssuesResponse {
  message: string;
  data: AdminDealerIssueApiItem[];
}

// Admin Farms Types
export interface AdminFarmDetail {
  id: number;
  latitude: number;
  farm_name: string;
  farm_size: number;
  farm_type: string;
  longitude: number;
  created_at: string;
  updated_at: string;
  current_feed: number;
  days_on_feed: string;
  location_city: string;
  user_profile_id: number;
  location_barangay: string;
  location_province: string;
}

export interface AdminFarmerData {
  id: number;
  last_name: string;
  first_name: string;
  farmer_details: AdminFarmDetail[];
}

export interface AdminSalesRepDetail {
  id: number;
  territory: string;
  created_at: string;
  updated_at: string;
  employee_id: string;
  quota_monthly: number;
  user_profile_id: number;
}

export interface AdminSalesRepData {
  id: number;
  last_name: string | null;
  first_name: string | null;
  salesrep_details: AdminSalesRepDetail[];
  count: number;
}

export interface AdminFarmApiItem {
  company_id: number;
  farmer: AdminFarmerData;
  salesrep: AdminSalesRepData;
}

export interface AdminFarmsResponse {
  message: string;
  data: AdminFarmApiItem[];
}
