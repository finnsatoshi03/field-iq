import type {
  ActiveFeedProductResponse,
  ActiveFeedProgramResponse,
  ChatAiRequest,
  ChatAiResponse,
  CompleteFeedProgramResponse,
  CreateFeedCalculationLogRequest,
  CreateFeedProgramRequest,
  CreateFeedProgramResponse,
  FeedCalculationLogResponse,
  FeedIntakeBehavior,
  GrowthPerformanceResponse,
  HealthWatch,
  IncompleteFeedProgramResponse,
  UpdateFeedCalculationLogRequest,
} from "@/features/farmer/types";
import { fieldIQService } from "@/services/field-iq-service";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query key factory for farmer v2 queries
export const farmerV2Keys = {
  all: ["farmer-v2"] as const,
  feedPrograms: () => [...farmerV2Keys.all, "feed-programs"] as const,
  activeFeedProgram: (farmerUserProfileId: number) =>
    [...farmerV2Keys.feedPrograms(), "active", farmerUserProfileId] as const,
  activeFeedProduct: (farmerUserProfileId: number) =>
    [
      ...farmerV2Keys.feedPrograms(),
      "active-product",
      farmerUserProfileId,
    ] as const,
  chatAi: () => [...farmerV2Keys.all, "chat-ai"] as const,
  growthPerformance: (farmerUserProfileId: number) =>
    [...farmerV2Keys.all, "growth-performance", farmerUserProfileId] as const,
  feedCalculationLog: (farmerUserProfileId: number) =>
    [...farmerV2Keys.all, "feed-calculation-log", farmerUserProfileId] as const,
  healthWatch: (farmerUserProfileId: number, filter?: string) =>
    [...farmerV2Keys.all, "health-watch", farmerUserProfileId, filter] as const,
  feedIntakeBehavior: (farmerUserProfileId: number) =>
    [...farmerV2Keys.all, "feed-intake-behavior", farmerUserProfileId] as const,
};

// Chat AI Hook
export const useChatAi = (
  options?: Omit<
    UseMutationOptions<ChatAiResponse, Error, ChatAiRequest>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: (chatData: ChatAiRequest) => fieldIQService.chatAi(chatData),
    ...options,
  });
};

// Create Feed Program Hook
export const useCreateFeedProgram = (
  options?: Omit<
    UseMutationOptions<
      CreateFeedProgramResponse,
      Error,
      CreateFeedProgramRequest
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programData: CreateFeedProgramRequest) =>
      fieldIQService.createFeedProgram(programData),
    onSuccess: (_, variables) => {
      // Invalidate and refetch active feed program for this farmer
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.activeFeedProgram(
          variables.farmer_user_profile_id,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.activeFeedProduct(
          variables.farmer_user_profile_id,
        ),
      });
    },
    ...options,
  });
};

// Get Active Feed Program Hook
export const useActiveFeedProgram = (
  farmerUserProfileId: number,
  options?: Omit<
    UseQueryOptions<ActiveFeedProgramResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: farmerV2Keys.activeFeedProgram(farmerUserProfileId),
    queryFn: () => fieldIQService.getActiveFeedProgram(farmerUserProfileId),
    enabled: farmerUserProfileId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
    ...options,
  });
};

// Get Active Feed Product Hook
export const useActiveFeedProduct = (
  farmerUserProfileId: number,
  options?: Omit<
    UseQueryOptions<ActiveFeedProductResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: farmerV2Keys.activeFeedProduct(farmerUserProfileId),
    queryFn: () => fieldIQService.getActiveFeedProduct(farmerUserProfileId),
    enabled: farmerUserProfileId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
    ...options,
  });
};

// Complete Feed Program Hook
export const useCompleteFeedProgram = (
  options?: Omit<
    UseMutationOptions<CompleteFeedProgramResponse, Error, number>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (farmerUserProfileId: number) =>
      fieldIQService.completeFeedProgram(farmerUserProfileId),
    onSuccess: (_, farmerUserProfileId) => {
      // Invalidate and refetch active feed program for this farmer
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.activeFeedProgram(farmerUserProfileId),
      });
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.activeFeedProduct(farmerUserProfileId),
      });
    },
    ...options,
  });
};

// Incomplete Feed Program Hook
export const useIncompleteFeedProgram = (
  options?: Omit<
    UseMutationOptions<IncompleteFeedProgramResponse, Error, number>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (farmerUserProfileId: number) =>
      fieldIQService.incompleteFeedProgram(farmerUserProfileId),
    onSuccess: (_, farmerUserProfileId) => {
      // Invalidate and refetch active feed program for this farmer
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.activeFeedProgram(farmerUserProfileId),
      });
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.activeFeedProduct(farmerUserProfileId),
      });
    },
    ...options,
  });
};

// Utility hook for invalidating farmer v2 queries
export const useInvalidateFarmerV2Queries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateActiveFeedProgram: (farmerUserProfileId: number) => {
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.activeFeedProgram(farmerUserProfileId),
      });
    },
    invalidateActiveFeedProduct: (farmerUserProfileId: number) => {
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.activeFeedProduct(farmerUserProfileId),
      });
    },
    invalidateAllFeedPrograms: () => {
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.feedPrograms(),
      });
    },
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.all,
      });
    },
  };
};

// Get Growth Performance Hook
export const useGrowthPerformance = (
  farmerUserProfileId: number,
  options?: Omit<
    UseQueryOptions<GrowthPerformanceResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: farmerV2Keys.growthPerformance(farmerUserProfileId),
    queryFn: () => fieldIQService.getGrowthPerformance(farmerUserProfileId),
    enabled: farmerUserProfileId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
    ...options,
  });
};

// Get Feed Calculation Log Hook
export const useFeedCalculationLog = (
  farmerUserProfileId: number,
  options?: Omit<
    UseQueryOptions<FeedCalculationLogResponse | null, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: farmerV2Keys.feedCalculationLog(farmerUserProfileId),
    queryFn: () => fieldIQService.getFeedCalculationLog(farmerUserProfileId),
    enabled: farmerUserProfileId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
    ...options,
  });
};

// Create Feed Calculation Log Hook
export const useCreateFeedCalculationLog = (
  options?: Omit<
    UseMutationOptions<
      FeedCalculationLogResponse,
      Error,
      CreateFeedCalculationLogRequest
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: (logData: CreateFeedCalculationLogRequest) =>
      fieldIQService.createFeedCalculationLog(logData),
    ...options,
  });
};

// Update Feed Calculation Log Hook
export const useUpdateFeedCalculationLog = (
  options?: Omit<
    UseMutationOptions<
      FeedCalculationLogResponse,
      Error,
      { farmerUserProfileId: number; logData: UpdateFeedCalculationLogRequest }
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: ({ farmerUserProfileId, logData }) =>
      fieldIQService.updateFeedCalculationLog(farmerUserProfileId, logData),
    ...options,
  });
};

// Health Watch Hook
export const useHealthWatch = (
  farmerUserProfileId: number,
  filter?: string,
  options?: Omit<UseQueryOptions<HealthWatch, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: farmerV2Keys.healthWatch(farmerUserProfileId, filter),
    queryFn: () => fieldIQService.getHealthWatch(farmerUserProfileId, filter),
    enabled: farmerUserProfileId > 0,
    ...options,
  });
};

// Feed Intake Behavior Hook
export const useFeedIntakeBehavior = (
  farmerUserProfileId: number,
  options?: Omit<
    UseQueryOptions<FeedIntakeBehavior, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: farmerV2Keys.feedIntakeBehavior(farmerUserProfileId),
    queryFn: () => fieldIQService.getFeedIntakeBehavior(farmerUserProfileId),
    enabled: farmerUserProfileId > 0,
    ...options,
  });
};
