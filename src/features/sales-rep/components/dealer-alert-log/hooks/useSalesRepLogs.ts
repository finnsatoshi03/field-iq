import type { SalesRepLogsResponse } from "@/features/sales-rep/types";
import { fieldIQService } from "@/services/field-iq-service";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// Query key factory for sales rep logs queries
export const salesRepLogsKeys = {
  all: ["sales-rep-logs"] as const,
  byUserId: (userId: number) => [...salesRepLogsKeys.all, userId] as const,
};

// Hook for fetching sales rep logs data
export const useSalesRepLogs = (
  userId: number,
  options?: Omit<
    UseQueryOptions<SalesRepLogsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: salesRepLogsKeys.byUserId(userId),
    queryFn: () => fieldIQService.getSalesRepLogs(userId),
    enabled: userId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};
