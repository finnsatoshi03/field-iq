import type { MonthlySalesResponse } from "@/features/sales-rep/types";
import { fieldIQService } from "@/services/field-iq-service";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// Query key factory for monthly sales queries
export const monthlySalesKeys = {
  all: ["monthly-sales"] as const,
  byUserId: (userId: number) => [...monthlySalesKeys.all, userId] as const,
};

// Hook for fetching monthly sales data
export const useMonthlySales = (
  userId: number,
  options?: Omit<
    UseQueryOptions<MonthlySalesResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: monthlySalesKeys.byUserId(userId),
    queryFn: () => fieldIQService.getSalesRepMonthlySales(userId),
    enabled: userId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};
