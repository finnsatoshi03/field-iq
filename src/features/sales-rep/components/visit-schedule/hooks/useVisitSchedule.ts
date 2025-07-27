import type { VisitScheduleResponse } from "@/features/sales-rep/types";
import { fieldIQService } from "@/services/field-iq-service";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// Query key factory for visit schedule queries
export const visitScheduleKeys = {
  all: ["visit-schedule"] as const,
  byUserId: (userId: number) => [...visitScheduleKeys.all, userId] as const,
};

// Hook for fetching visit schedule data
export const useVisitSchedule = (
  userId: number,
  options?: Omit<
    UseQueryOptions<VisitScheduleResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: visitScheduleKeys.byUserId(userId),
    queryFn: () => fieldIQService.getVisitSchedule(userId),
    enabled: userId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};
