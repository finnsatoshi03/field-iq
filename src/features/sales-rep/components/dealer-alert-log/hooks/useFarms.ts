import type { FarmsResponse } from "@/features/sales-rep/types";
import { fieldIQService } from "@/services/field-iq-service";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// Query key factory for farms queries
export const farmsKeys = {
  all: ["farms"] as const,
  byUserId: (userId: number) => [...farmsKeys.all, userId] as const,
};

// Hook for fetching farms data
export const useFarms = (
  userId: number,
  options?: Omit<UseQueryOptions<FarmsResponse, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: farmsKeys.byUserId(userId),
    queryFn: () => fieldIQService.getFarms(userId),
    enabled: userId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};
