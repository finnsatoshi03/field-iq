import type { AdminSalesResponse } from "@/features/admin/types";
import { fieldIQService } from "@/services/field-iq-service";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// Query key factory for admin sales queries
export const adminSalesKeys = {
  all: ["admin-sales"] as const,
  byCompanyId: (companyId: number) =>
    [...adminSalesKeys.all, companyId] as const,
};

// Hook for fetching admin sales data
export const useAdminSales = (
  companyId: number,
  options?: Omit<
    UseQueryOptions<AdminSalesResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: adminSalesKeys.byCompanyId(companyId),
    queryFn: () => fieldIQService.getAdminSales(companyId),
    enabled: companyId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};
