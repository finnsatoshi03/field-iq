import type { AdminFarmPerformanceResponse } from "@/features/admin/types";
import { fieldIQService } from "@/services/field-iq-service";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// Query key factory for admin farm performance queries
export const adminFarmPerformanceKeys = {
  all: ["admin-farm-performance"] as const,
  byCompanyId: (companyId: number) =>
    [...adminFarmPerformanceKeys.all, companyId] as const,
};

// Hook for fetching admin farm performance data
export const useAdminFarmPerformance = (
  companyId: number,
  options?: Omit<
    UseQueryOptions<AdminFarmPerformanceResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: adminFarmPerformanceKeys.byCompanyId(companyId),
    queryFn: () => fieldIQService.getAdminFarmPerformance(companyId),
    enabled: companyId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};
