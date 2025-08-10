import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useUser } from "@/hooks";
import {
  adminService,
  type AdminUser,
  type GenerateEmailLinkParams,
  type InviteUserParams,
} from "@/services/admin-service";

// Query keys
export const adminQueryKeys = {
  users: ["admin", "users"] as const,
  user: (id: string) => ["admin", "user", id] as const,
};

// Get users query
export const useGetUsers = (companyId?: number) => {
  const { isDev, isAdmin, isSalesRep } = useUser();

  return useQuery({
    queryKey: companyId
      ? [...adminQueryKeys.users, companyId]
      : adminQueryKeys.users,
    queryFn: () => {
      if (!isDev && !isAdmin && !isSalesRep) {
        throw new Error("Access denied. Dev role required.");
      }

      // If companyId is provided, use the company-specific method
      if (companyId) {
        return adminService
          .getUsersByCompanyId(companyId)
          .then((users) =>
            users.filter(
              (user) =>
                user.user_metadata.role !== "admin" &&
                user.user_metadata.role !== "dev",
            ),
          );
      }

      // Otherwise use the original method
      if (isAdmin) {
        return adminService
          .getUsers()
          .then((users) =>
            users.filter(
              (user) =>
                user.user_metadata.role !== "admin" &&
                user.user_metadata.role !== "dev",
            ),
          );
      }
      if (isSalesRep) {
        return adminService
          .getUsers()
          .then((users) =>
            users.filter(
              (user) =>
                user.user_metadata.role !== "sales_rep" &&
                user.user_metadata.role !== "admin" &&
                user.user_metadata.role !== "dev",
            ),
          );
      }
      return adminService.getUsers();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled:
      (isDev || isAdmin || isSalesRep) && (companyId ? companyId > 0 : true), // Only enable query if user has dev role and companyId is valid
  });
};

// Get user by ID query
export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: adminQueryKeys.user(userId),
    queryFn: () => adminService.getUserById(userId),
    enabled: !!userId,
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { isDev, isAdmin, isSalesRep } = useUser();

  return useMutation({
    mutationFn: (params: {
      email: string;
      password: string;
      user_metadata?: Record<string, any>;
      email_confirm?: boolean;
    }) => {
      if (!isDev && !isAdmin && !isSalesRep) {
        throw new Error("Access denied. Dev role required.");
      }
      return adminService.createUser(params);
    },
    onSuccess: (newUser) => {
      // Update users cache
      queryClient.setQueryData<AdminUser[]>(adminQueryKeys.users, (old) =>
        old ? [...old, newUser] : [newUser],
      );

      toast.success(`User ${newUser.email} created successfully`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create user");
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { isDev, isAdmin, isSalesRep } = useUser();

  return useMutation({
    mutationFn: (userId: string) => {
      if (!isDev && !isAdmin && !isSalesRep) {
        throw new Error("Access denied. Dev role required.");
      }
      return adminService.deleteUser(userId);
    },
    onSuccess: (_, userId) => {
      // Remove user from cache
      queryClient.setQueryData<AdminUser[]>(adminQueryKeys.users, (old) =>
        old ? old.filter((user) => user.id !== userId) : [],
      );

      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { isDev, isAdmin, isSalesRep } = useUser();

  return useMutation({
    mutationFn: ({
      userId,
      updates,
    }: {
      userId: string;
      updates: {
        email?: string;
        user_metadata?: Record<string, any>;
        app_metadata?: Record<string, any>;
      };
    }) => {
      if (!isDev && !isAdmin && !isSalesRep) {
        throw new Error("Access denied. Dev role required.");
      }
      return adminService.updateUser(userId, updates);
    },
    onSuccess: (updatedUser, { userId }) => {
      // Update user in cache
      queryClient.setQueryData<AdminUser[]>(adminQueryKeys.users, (old) =>
        old ? old.map((user) => (user.id === userId ? updatedUser : user)) : [],
      );

      // Update individual user cache
      queryClient.setQueryData(adminQueryKeys.user(userId), updatedUser);

      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user");
    },
  });
};

// Generate email link mutation
export const useGenerateEmailLink = () => {
  const { isDev, isAdmin, isSalesRep } = useUser();

  return useMutation({
    mutationFn: (params: GenerateEmailLinkParams) => {
      if (!isDev && !isAdmin && !isSalesRep) {
        throw new Error("Access denied. Dev role required.");
      }
      return adminService.generateEmailLink(params);
    },
    onSuccess: (data, params) => {
      const linkType = params.type.replace("_", " ").toUpperCase();
      toast.success(`${linkType} link generated successfully`);

      // Copy link to clipboard if available
      if (data.action_link && navigator.clipboard) {
        navigator.clipboard.writeText(data.action_link);
        toast.info("Link copied to clipboard");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to generate email link");
    },
  });
};

// Invite user by email mutation
export const useInviteUserByEmail = () => {
  const { isDev, isAdmin, isSalesRep } = useUser();

  return useMutation({
    mutationFn: (params: InviteUserParams) => {
      if (!isDev && !isAdmin && !isSalesRep) {
        throw new Error("Access denied. Dev role required.");
      }
      return adminService.inviteUserByEmail(params);
    },
    onSuccess: (data, params) => {
      if (data.error) {
        throw new Error(data.error.message);
      }

      toast.success(`Invitation sent to ${params.email}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send invitation");
    },
  });
};
