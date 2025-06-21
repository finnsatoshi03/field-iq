import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  adminService,
  type AdminUser,
  type GenerateEmailLinkParams,
} from "@/services/admin-service";
import { useUser } from "@/hooks";

// Query keys
export const adminQueryKeys = {
  users: ["admin", "users"] as const,
  user: (id: string) => ["admin", "user", id] as const,
};

// Get users query
export const useGetUsers = () => {
  const { isDev } = useUser();

  return useQuery({
    queryKey: adminQueryKeys.users,
    queryFn: () => {
      if (!isDev) {
        throw new Error("Access denied. Dev role required.");
      }
      return adminService.getUsers();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isDev, // Only enable query if user has dev role
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
  const { isDev } = useUser();

  return useMutation({
    mutationFn: (params: {
      email: string;
      password: string;
      user_metadata?: Record<string, any>;
      email_confirm?: boolean;
    }) => {
      if (!isDev) {
        throw new Error("Access denied. Dev role required.");
      }
      return adminService.createUser(params);
    },
    onSuccess: (newUser) => {
      // Update users cache
      queryClient.setQueryData<AdminUser[]>(adminQueryKeys.users, (old) =>
        old ? [...old, newUser] : [newUser]
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
  const { isDev } = useUser();

  return useMutation({
    mutationFn: (userId: string) => {
      if (!isDev) {
        throw new Error("Access denied. Dev role required.");
      }
      return adminService.deleteUser(userId);
    },
    onSuccess: (_, userId) => {
      // Remove user from cache
      queryClient.setQueryData<AdminUser[]>(adminQueryKeys.users, (old) =>
        old ? old.filter((user) => user.id !== userId) : []
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
  const { isDev } = useUser();

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
      if (!isDev) {
        throw new Error("Access denied. Dev role required.");
      }
      return adminService.updateUser(userId, updates);
    },
    onSuccess: (updatedUser, { userId }) => {
      // Update user in cache
      queryClient.setQueryData<AdminUser[]>(adminQueryKeys.users, (old) =>
        old ? old.map((user) => (user.id === userId ? updatedUser : user)) : []
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
  const { isDev } = useUser();

  return useMutation({
    mutationFn: (params: GenerateEmailLinkParams) => {
      if (!isDev) {
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
