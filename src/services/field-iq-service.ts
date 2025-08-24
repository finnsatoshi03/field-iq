import { FIELD_IQ_API_CONFIG } from "@/lib/config";

import type {
  AdminDealerIssuesResponse,
  AdminFaqsResponse,
  AdminFarmPerformanceResponse,
  AdminFarmsResponse,
  AdminSalesResponse,
  CreateFaqRequest,
  CreateFaqResponse,
  CreateSalesGoalRequest,
  CreateSalesGoalResponse,
  CurrentSalesGoalResponse,
  DeleteFaqResponse,
  SalesGoalsResponse,
  UpdateFaqRequest,
  UpdateFaqResponse,
  UpdateSalesGoalRequest,
  UpdateSalesGoalResponse,
} from "@/features/admin/types";
import type {
  ActiveFeedProductResponse,
  ActiveFeedProgramResponse,
  ChatAiRequest,
  ChatAiResponse,
  CompleteFeedProgramResponse,
  CreateFeedProgramRequest,
  CreateFeedProgramResponse,
  FarmerDashboardData,
  GrowthPerformanceResponse,
  IncompleteFeedProgramResponse,
} from "@/features/farmer/types";
import type {
  FarmsResponse,
  MonthlySalesResponse,
  SalesRepLogsResponse,
  VisitScheduleResponse,
} from "@/features/sales-rep/types";

// Types for the Field IQ API responses
export interface FarmerDashboardViewModel extends FarmerDashboardData {
  farmer_user_profile_id: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Base API client for Field IQ backend
class FieldIQApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = FIELD_IQ_API_CONFIG.baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        return {
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        status: 0,
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Create singleton instance
const apiClient = new FieldIQApiClient();

// Field IQ API service functions
export const fieldIQService = {
  // Farmer Dashboard View Model
  async getFarmerDashboard(
    farmerUserProfileId: number,
  ): Promise<FarmerDashboardViewModel> {
    if (farmerUserProfileId <= 0) {
      throw new Error("Invalid user profile ID.");
    }

    const response = await apiClient.get<FarmerDashboardViewModel>(
      `${FIELD_IQ_API_CONFIG.endpoints.farmerDashboard}/${farmerUserProfileId}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Farmer V2 API Methods

  // Chat AI Service
  async chatAi(chatData: ChatAiRequest): Promise<ChatAiResponse> {
    const response = await apiClient.post<ChatAiResponse>(
      FIELD_IQ_API_CONFIG.endpoints.farmer_v2.chat_ai,
      chatData,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Create Feed Program
  async createFeedProgram(
    programData: CreateFeedProgramRequest,
  ): Promise<CreateFeedProgramResponse> {
    const response = await apiClient.post<CreateFeedProgramResponse>(
      FIELD_IQ_API_CONFIG.endpoints.farmer_v2.feed_programs,
      programData,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Get Active Feed Program
  async getActiveFeedProgram(
    farmerUserProfileId: number,
  ): Promise<ActiveFeedProgramResponse> {
    if (farmerUserProfileId <= 0) {
      throw new Error("Invalid farmer user profile ID.");
    }

    const response = await apiClient.get<ActiveFeedProgramResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.farmer_v2.feed_programs_active}/${farmerUserProfileId}/active`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Get Active Feed Product
  async getActiveFeedProduct(
    farmerUserProfileId: number,
  ): Promise<ActiveFeedProductResponse> {
    if (farmerUserProfileId <= 0) {
      throw new Error("Invalid farmer user profile ID.");
    }

    const response = await apiClient.get<ActiveFeedProductResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.farmer_v2.feed_programs_active_product}/${farmerUserProfileId}/feed-product/active`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Complete Active Feed Program
  async completeFeedProgram(
    farmerUserProfileId: number,
  ): Promise<CompleteFeedProgramResponse> {
    if (farmerUserProfileId <= 0) {
      throw new Error("Invalid farmer user profile ID.");
    }

    const response = await apiClient.put<CompleteFeedProgramResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.farmer_v2.feed_programs_complete}/${farmerUserProfileId}/complete`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Incomplete Active Feed Program
  async incompleteFeedProgram(
    farmerUserProfileId: number,
  ): Promise<IncompleteFeedProgramResponse> {
    if (farmerUserProfileId <= 0) {
      throw new Error("Invalid farmer user profile ID.");
    }

    const response = await apiClient.put<IncompleteFeedProgramResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.farmer_v2.feed_programs_incomplete}/${farmerUserProfileId}/incomplete`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Get Growth Performance
  async getGrowthPerformance(
    farmerUserProfileId: number,
  ): Promise<GrowthPerformanceResponse> {
    if (farmerUserProfileId <= 0) {
      throw new Error("Invalid farmer user profile ID.");
    }

    const response = await apiClient.get<GrowthPerformanceResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.farmer_v2.growth_performance}/${farmerUserProfileId}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Sales Rep Monthly Sales
  async getSalesRepMonthlySales(userId: number): Promise<MonthlySalesResponse> {
    if (userId <= 0) {
      throw new Error("Invalid user ID.");
    }

    const response = await apiClient.get<MonthlySalesResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.sales_rep.monthly_sales}?user_id=${userId}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Sales Rep Logs
  async getSalesRepLogs(userId: number): Promise<SalesRepLogsResponse> {
    if (userId <= 0) {
      throw new Error("Invalid user ID.");
    }

    const response = await apiClient.get<SalesRepLogsResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.sales_rep.sales_rep_logs}?user_id=${userId}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Sales Rep Farms
  async getFarms(userId: number): Promise<FarmsResponse> {
    if (userId <= 0) {
      throw new Error("Invalid user ID.");
    }

    const response = await apiClient.get<FarmsResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.sales_rep.farms}?user_id=${userId}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Sales Rep Visit Schedule
  async getVisitSchedule(userId: number): Promise<VisitScheduleResponse> {
    if (userId <= 0) {
      throw new Error("Invalid user ID.");
    }

    const response = await apiClient.get<VisitScheduleResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.sales_rep.visit_schedule}?user_id=${userId}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Admin Sales
  async getAdminSales(companyId: number): Promise<AdminSalesResponse> {
    if (companyId <= 0) {
      throw new Error("Invalid company ID.");
    }

    const response = await apiClient.get<AdminSalesResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.admin.sales}?company_id=${companyId}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Admin Dealer Issues
  async getAdminDealerIssues(
    companyId: number,
  ): Promise<AdminDealerIssuesResponse> {
    if (companyId <= 0) {
      throw new Error("Invalid company ID.");
    }

    const response = await apiClient.get<AdminDealerIssuesResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.admin.dealer_issues}?company_id=${companyId}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Admin Farms
  async getAdminFarms(companyId: number): Promise<AdminFarmsResponse> {
    if (companyId <= 0) {
      throw new Error("Invalid company ID.");
    }

    const response = await apiClient.get<AdminFarmsResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.admin.farms}?company_id=${companyId}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Admin Farm Performance
  async getAdminFarmPerformance(
    companyId: number,
  ): Promise<AdminFarmPerformanceResponse> {
    if (companyId <= 0) {
      throw new Error("Invalid company ID.");
    }

    const response = await apiClient.get<AdminFarmPerformanceResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.admin.farm_performance}?company_id=${companyId}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Admin FAQs
  async getAdminFaqs(companyId: number): Promise<AdminFaqsResponse> {
    const response = await apiClient.get<AdminFaqsResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.admin.faqs}?company_id=${companyId}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Create FAQ
  async createAdminFaq(faqData: CreateFaqRequest): Promise<CreateFaqResponse> {
    const response = await apiClient.post<CreateFaqResponse>(
      FIELD_IQ_API_CONFIG.endpoints.admin.faqs,
      faqData,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Update FAQ
  async updateAdminFaq(
    faqId: number,
    faqData: UpdateFaqRequest,
  ): Promise<UpdateFaqResponse> {
    const response = await apiClient.put<UpdateFaqResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.admin.faqs}/${faqId}`,
      faqData,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Delete FAQ
  async deleteAdminFaq(faqId: number): Promise<DeleteFaqResponse> {
    const response = await apiClient.delete<DeleteFaqResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.admin.faqs}/${faqId}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Sales Goals
  async getSalesGoals(companyId: number): Promise<SalesGoalsResponse> {
    const response = await apiClient.get<SalesGoalsResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.admin.sales_goals}?company_id=${companyId}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  async getCurrentSalesGoal(
    companyId: number,
  ): Promise<CurrentSalesGoalResponse> {
    const response = await apiClient.get<CurrentSalesGoalResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.admin.sales_goals_current}?company_id=${companyId}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  async createSalesGoal(
    goalData: CreateSalesGoalRequest,
  ): Promise<CreateSalesGoalResponse> {
    const response = await apiClient.post<CreateSalesGoalResponse>(
      FIELD_IQ_API_CONFIG.endpoints.admin.sales_goals,
      goalData,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  async updateSalesGoal(
    goalId: number,
    goalData: UpdateSalesGoalRequest,
  ): Promise<UpdateSalesGoalResponse> {
    const response = await apiClient.put<UpdateSalesGoalResponse>(
      `${FIELD_IQ_API_CONFIG.endpoints.admin.sales_goals}/${goalId}`,
      goalData,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },

  // Health check for the API
  async healthCheck(): Promise<{ status: string }> {
    const response = await apiClient.get<{ status: string }>("/health");

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data || { status: "unknown" };
  },

  // Generic method to call any endpoint
  async callEndpoint<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any,
  ): Promise<T> {
    let response: ApiResponse<T>;

    switch (method) {
      case "GET":
        response = await apiClient.get<T>(endpoint);
        break;
      case "POST":
        response = await apiClient.post<T>(endpoint, body);
        break;
      case "PUT":
        response = await apiClient.put<T>(endpoint, body);
        break;
      case "DELETE":
        response = await apiClient.delete<T>(endpoint);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },
};
