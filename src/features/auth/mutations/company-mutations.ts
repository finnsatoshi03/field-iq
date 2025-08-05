import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useUser } from "@/hooks";
import { authService } from "@/services/auth-service";
import {
  companyService,
  type Company,
  type CreateCompanyParams,
  type UpdateCompanyParams,
} from "@/services/company-service";
import { useUserStore } from "@/store/user-store";

// Query keys
export const companyQueryKeys = {
  companies: ["companies"] as const,
  company: (id: number) => ["company", id] as const,
  userCompany: (userId: string) => ["user-company", userId] as const,
};

// Get all companies query
export const useGetCompanies = () => {
  const { isAdmin } = useUser();

  return useQuery({
    queryKey: companyQueryKeys.companies,
    queryFn: () => companyService.getCompanies(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isAdmin,
  });
};

// Get company by ID query
export const useGetCompany = (id: number) => {
  return useQuery({
    queryKey: companyQueryKeys.company(id),
    queryFn: () => companyService.getCompanyById(id),
    enabled: !!id,
  });
};

// Get company by user ID query
export const useGetUserCompany = (userId: string) => {
  return useQuery({
    queryKey: companyQueryKeys.userCompany(userId),
    queryFn: () => companyService.getCompanyByUserId(userId),
    enabled: !!userId,
  });
};

// Create company mutation
export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useUser();

  return useMutation({
    mutationFn: (params: CreateCompanyParams) => {
      if (!isAdmin) {
        throw new Error("Access denied. Admin role required.");
      }
      return companyService.createCompany(params);
    },
    onSuccess: (newCompany) => {
      // Update companies cache
      queryClient.setQueryData<Company[]>(companyQueryKeys.companies, (old) =>
        old ? [...old, newCompany] : [newCompany],
      );

      // Update individual company cache
      queryClient.setQueryData(
        companyQueryKeys.company(newCompany.id),
        newCompany,
      );

      toast.success(`Company "${newCompany.name}" created successfully`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create company");
    },
  });
};

// Update company mutation
export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useUser();

  return useMutation({
    mutationFn: ({
      id,
      params,
    }: {
      id: number;
      params: UpdateCompanyParams;
    }) => {
      if (!isAdmin) {
        throw new Error("Access denied. Admin role required.");
      }
      return companyService.updateCompany(id, params);
    },
    onSuccess: (updatedCompany, { id }) => {
      // Update companies cache
      queryClient.setQueryData<Company[]>(companyQueryKeys.companies, (old) =>
        old
          ? old.map((company) => (company.id === id ? updatedCompany : company))
          : [],
      );

      // Update individual company cache
      queryClient.setQueryData(companyQueryKeys.company(id), updatedCompany);

      toast.success("Company updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update company");
    },
  });
};

// Delete company mutation
export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useUser();

  return useMutation({
    mutationFn: (id: number) => {
      if (!isAdmin) {
        throw new Error("Access denied. Admin role required.");
      }
      return companyService.deleteCompany(id);
    },
    onSuccess: (_, id) => {
      // Remove company from cache
      queryClient.setQueryData<Company[]>(companyQueryKeys.companies, (old) =>
        old ? old.filter((company) => company.id !== id) : [],
      );

      // Remove individual company cache
      queryClient.removeQueries({ queryKey: companyQueryKeys.company(id) });

      toast.success("Company deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete company");
    },
  });
};

// Update user's company_id mutation
export const useUpdateUserCompanyId = () => {
  const queryClient = useQueryClient();
  const updateUser = useUserStore((state) => state.updateUser);

  return useMutation({
    mutationFn: ({
      userId,
      companyId,
    }: {
      userId: string;
      companyId: number;
    }) => {
      return authService.updateUserCompanyId(userId, companyId);
    },
    onSuccess: (updatedProfile, { companyId }) => {
      // Update user store
      updateUser({ company_id: companyId });

      // Invalidate user company query
      queryClient.invalidateQueries({
        queryKey: companyQueryKeys.userCompany(updatedProfile.identity_id),
      });

      toast.success("Company assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to assign company");
    },
  });
};
