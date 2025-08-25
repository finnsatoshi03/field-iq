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
  farm_type: string | null;
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

// Farm Performance Types
export interface AdminPerformanceMetric {
  id: number;
  productId: number;
  productName: number;
  farmId: number;
  farmName: string;
  region: string;
  province: string;
  gpsCoordinates: {
    lat: number;
    lng: number;
  };
  recordDate: string;
  batchSize: number | null;
  daysOnFeed: string;
  fcr: number;
  weightGain: number | null;
  mortality: number;
  avgWeight: number;
  feedIntake: number;
  weatherCondition: string;
  managementScore: number;
  reportedBy: string;
  verified: boolean;
}

export interface AdminRegionalPerformance {
  region: string;
  province: string;
  gpsCoordinates: {
    lat: number;
    lng: number;
  };
  totalFarms: number;
  avgFcr: number;
  avgWeightGain: number;
  avgMortality: number;
  topProduct: number;
  performanceRating: string;
  lastUpdate: string;
}

export interface AdminPerformanceTimeline {
  date: string;
  fcr: number;
  weightGain: number;
  mortality: number | null;
  feedIntake: number;
  managementScore: number;
}

export interface AdminFarmPerformanceData {
  metrics: AdminPerformanceMetric[];
  regional: AdminRegionalPerformance[];
  timeline: AdminPerformanceTimeline[];
}

export interface AdminFarmPerformanceResponse {
  message: string;
  data: AdminFarmPerformanceData;
}

// FAQ Types
export interface AdminFaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  status: string;
  priority: number;
  views: number;
  lastUpdated: string;
  createdBy: string;
  tags: string[];
  is_featured?: boolean; // Added field from API
}

export interface AdminFaqsResponse {
  message: string;
  data: AdminFaqItem[];
}

// FAQ CRUD Request Types
export interface CreateFaqRequest {
  question: string;
  answer: string;
  category: string;
  is_featured: boolean;
}

export interface UpdateFaqRequest {
  question: string;
  answer: string;
  category: string;
  is_featured: boolean;
}

// FAQ CRUD Response Types
export interface CreateFaqResponse {
  message: string;
  data: AdminFaqItem;
}

export interface UpdateFaqResponse {
  message: string;
  data: AdminFaqItem;
}

export interface DeleteFaqResponse {
  message: string;
}

// Sales Goal Types
export interface SalesGoal {
  id: number;
  company_id: number;
  target_amount: number;
  period_start: string;
  period_end: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  status?: "active" | "locked" | "future";
}

export interface SalesGoalsResponse {
  message: string;
  data: SalesGoal[];
}

export interface CurrentSalesGoalResponse {
  message: string;
  data: SalesGoal | null;
}

export interface CreateSalesGoalRequest {
  company_id: number;
  target_amount: number;
  period_start: string;
  period_end: string;
  created_by: number;
}

export interface UpdateSalesGoalRequest {
  target_amount?: number;
}

export interface CreateSalesGoalResponse {
  message: string;
  data: SalesGoal;
}

export interface UpdateSalesGoalResponse {
  message: string;
  data: SalesGoal;
}
