import type { AdminDealerIssuesResponse } from "@/features/admin/types";
import { fieldIQService } from "@/services/field-iq-service";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// Query key factory for admin dealer issues queries
export const adminDealerIssuesKeys = {
  all: ["admin-dealer-issues"] as const,
  byCompanyId: (companyId: number) =>
    [...adminDealerIssuesKeys.all, companyId] as const,
};

// Hook for fetching admin dealer issues data
export const useAdminDealerIssues = (
  companyId: number,
  options?: Omit<
    UseQueryOptions<AdminDealerIssuesResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: adminDealerIssuesKeys.byCompanyId(companyId),
    queryFn: () => fieldIQService.getAdminDealerIssues(companyId),
    enabled: companyId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};
