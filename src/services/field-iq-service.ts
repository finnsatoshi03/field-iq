import { FIELD_IQ_API_CONFIG } from "@/lib/config";

import type { FarmerDashboardData } from "@/features/farmer/types";

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
