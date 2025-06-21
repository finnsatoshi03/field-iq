import { useUserStore } from "@/store/user-store";

export const useUser = () => {
  const { user, isAuthenticated, isLoading } = useUserStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    // Helper computed values
    isAdmin: user?.role === "admin",
    isSalesRep: user?.role === "sales_rep",
    isFarmer: user?.role === "farmer",
    isDev: user?.role === "dev",
    userName: user?.name || user?.email?.split("@")[0] || "User",
  };
};
