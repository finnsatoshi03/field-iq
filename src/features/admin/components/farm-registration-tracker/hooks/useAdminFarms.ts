import type { AdminFarmsResponse } from "@/features/admin/types";
import { fieldIQService } from "@/services/field-iq-service";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// Query key factory for admin farms queries
export const adminFarmsKeys = {
  all: ["admin-farms"] as const,
  byCompanyId: (companyId: number) =>
    [...adminFarmsKeys.all, companyId] as const,
};

// Hook for fetching admin farms data
export const useAdminFarms = (
  companyId: number,
  options?: Omit<
    UseQueryOptions<AdminFarmsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: adminFarmsKeys.byCompanyId(companyId),
    queryFn: () => fieldIQService.getAdminFarms(companyId),
    enabled: companyId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};
