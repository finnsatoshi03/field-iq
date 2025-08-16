import type {
  CreateSalesGoalRequest,
  CreateSalesGoalResponse,
  CurrentSalesGoalResponse,
  SalesGoalsResponse,
  UpdateSalesGoalRequest,
  UpdateSalesGoalResponse,
} from "@/features/admin/types";
import { fieldIQService } from "@/services/field-iq-service";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query key factory for sales goals queries
export const salesGoalsKeys = {
  all: ["sales-goals"] as const,
  byCompany: (companyId: number) => ["sales-goals", companyId] as const,
  current: (companyId: number) =>
    ["sales-goals", "current", companyId] as const,
};

// Hook for fetching all sales goals
export const useSalesGoals = (
  companyId: number,
  options?: Omit<
    UseQueryOptions<SalesGoalsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: salesGoalsKeys.byCompany(companyId),
    queryFn: () => fieldIQService.getSalesGoals(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};

// Hook for fetching current active sales goal
export const useCurrentSalesGoal = (
  companyId: number,
  options?: Omit<
    UseQueryOptions<CurrentSalesGoalResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: salesGoalsKeys.current(companyId),
    queryFn: () => fieldIQService.getCurrentSalesGoal(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};

// Hook for creating a new sales goal
export const useCreateSalesGoal = (
  options?: Omit<
    UseMutationOptions<CreateSalesGoalResponse, Error, CreateSalesGoalRequest>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalData: CreateSalesGoalRequest) =>
      fieldIQService.createSalesGoal(goalData),
    onSuccess: (data) => {
      // Invalidate and refetch sales goals for the company
      queryClient.invalidateQueries({
        queryKey: salesGoalsKeys.byCompany(data.data.company_id),
      });
      queryClient.invalidateQueries({
        queryKey: salesGoalsKeys.current(data.data.company_id),
      });
    },
    ...options,
  });
};

// Hook for updating an existing sales goal
export const useUpdateSalesGoal = (
  options?: Omit<
    UseMutationOptions<
      UpdateSalesGoalResponse,
      Error,
      { goalId: number; goalData: UpdateSalesGoalRequest; companyId: number }
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      goalId,
      goalData,
    }: {
      goalId: number;
      goalData: UpdateSalesGoalRequest;
      companyId: number;
    }) => fieldIQService.updateSalesGoal(goalId, goalData),
    onSuccess: (_data, variables) => {
      // Invalidate and refetch sales goals for the company
      queryClient.invalidateQueries({
        queryKey: salesGoalsKeys.byCompany(variables.companyId),
      });
      queryClient.invalidateQueries({
        queryKey: salesGoalsKeys.current(variables.companyId),
      });
    },
    ...options,
  });
};
