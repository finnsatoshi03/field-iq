import type {
  AdminFaqsResponse,
  CreateFaqRequest,
  CreateFaqResponse,
  DeleteFaqResponse,
  UpdateFaqRequest,
  UpdateFaqResponse,
} from "@/features/admin/types";
import { fieldIQService } from "@/services/field-iq-service";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query key factory for admin FAQs queries
export const adminFaqsKeys = {
  all: ["admin-faqs"] as const,
  byCompany: (companyId: number) => ["admin-faqs", companyId] as const,
};

// Hook for fetching admin FAQs data
export const useAdminFaqs = (
  companyId: number,
  options?: Omit<
    UseQueryOptions<AdminFaqsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: adminFaqsKeys.byCompany(companyId),
    queryFn: () => fieldIQService.getAdminFaqs(companyId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!companyId, // Only run query if companyId is provided
    ...options,
  });
};

// Hook for creating a new FAQ
export const useCreateFaq = (
  options?: Omit<
    UseMutationOptions<CreateFaqResponse, Error, CreateFaqRequest>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (faqData: CreateFaqRequest) =>
      fieldIQService.createAdminFaq(faqData),
    onSuccess: () => {
      // Invalidate and refetch FAQs list for all companies
      queryClient.invalidateQueries({ queryKey: adminFaqsKeys.all });
    },
    ...options,
  });
};

// Hook for updating an existing FAQ
export const useUpdateFaq = (
  options?: Omit<
    UseMutationOptions<
      UpdateFaqResponse,
      Error,
      { faqId: number; faqData: UpdateFaqRequest }
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      faqId,
      faqData,
    }: {
      faqId: number;
      faqData: UpdateFaqRequest;
    }) => fieldIQService.updateAdminFaq(faqId, faqData),
    onSuccess: () => {
      // Invalidate and refetch FAQs list for all companies
      queryClient.invalidateQueries({ queryKey: adminFaqsKeys.all });
    },
    ...options,
  });
};

// Hook for deleting a FAQ
export const useDeleteFaq = (
  options?: Omit<
    UseMutationOptions<DeleteFaqResponse, Error, number>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (faqId: number) => fieldIQService.deleteAdminFaq(faqId),
    onSuccess: () => {
      // Invalidate and refetch FAQs list for all companies
      queryClient.invalidateQueries({ queryKey: adminFaqsKeys.all });
    },
    ...options,
  });
};
