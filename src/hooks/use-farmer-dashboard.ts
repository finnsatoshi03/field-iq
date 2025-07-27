import type { FarmerDashboardViewModel } from "@/services/field-iq-service";
import { fieldIQService } from "@/services/field-iq-service";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// Query key factory for farmer dashboard queries
export const farmerDashboardKeys = {
  all: ["farmer-dashboard"] as const,
  byUserId: (userId: number) => [...farmerDashboardKeys.all, userId] as const,
};

// Hook for fetching farmer dashboard data
export const useFarmerDashboard = (
  farmerUserProfileId: number,
  options?: Omit<
    UseQueryOptions<FarmerDashboardViewModel, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: farmerDashboardKeys.byUserId(farmerUserProfileId),
    queryFn: () => fieldIQService.getFarmerDashboard(farmerUserProfileId),
    enabled: farmerUserProfileId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};

// Hook for refetching farmer dashboard data
export const useRefreshFarmerDashboard = () => {
  return {
    refreshDashboard: (farmerUserProfileId: number) => {
      // This will be used to invalidate and refetch specific dashboard data
      return farmerDashboardKeys.byUserId(farmerUserProfileId);
    },
    refreshAllDashboards: () => {
      // This will be used to invalidate all farmer dashboard data
      return farmerDashboardKeys.all;
    },
  };
};
