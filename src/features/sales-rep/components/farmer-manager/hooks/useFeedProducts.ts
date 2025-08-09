import {
  feedProductService,
  type FeedProduct,
} from "@/services/feed-product-service";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const feedProductsKeys = {
  all: ["feed-products"] as const,
  byCompany: (companyId?: number) =>
    companyId
      ? ([...feedProductsKeys.all, { companyId }] as const)
      : feedProductsKeys.all,
};

export const useFeedProducts = (
  {
    companyId,
    onlyActive = true,
  }: { companyId?: number; onlyActive?: boolean } = {},
  options?: Omit<UseQueryOptions<FeedProduct[], Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: feedProductsKeys.byCompany(companyId),
    queryFn: () =>
      feedProductService.getFeedProducts({ companyId, onlyActive }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    ...options,
  });
};
