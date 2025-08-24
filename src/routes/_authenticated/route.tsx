import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { BYPASS_AUTH } from "@/lib/config";
import { getDefaultDashboardRoute, hasRoutePermission } from "@/lib/rbac";
import { authService } from "@/services/auth-service";

import { CompanySetupModal } from "@/components/custom/CompanySetupModal";
import { Header } from "@/components/custom/header";
import { transformSupabaseUser, useUserStore } from "@/store/user-store";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    if (BYPASS_AUTH) {
      return;
    }

    // Note: Invite route is now a public route outside this authenticated layout

    try {
      // Check auth state directly from Supabase instead of Zustand store
      const user = await authService.getCurrentUser();

      if (!user) {
        throw redirect({
          to: "/auth/sign-in",
          search: {
            redirect: location.href,
          },
        });
      }

      // Check permissions for all authenticated routes
      const currentPath = location.pathname;
      const userRole = user.user_metadata?.role || "sales_rep";
      const hasPermission = hasRoutePermission(userRole, currentPath);

      if (!hasPermission) {
        // Redirect to their appropriate dashboard
        const defaultRoute = getDefaultDashboardRoute(userRole);
        throw redirect({
          to: defaultRoute,
        });
      }
    } catch (error) {
      // If any error occurs (including auth errors), redirect to sign-in
      if (error && typeof error === "object" && "to" in error) {
        throw error; // Re-throw redirect errors
      }
      throw redirect({
        to: "/auth/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, isAuthenticated, setUser, setLoading } = useUserStore();
  const [showCompanySetup, setShowCompanySetup] = useState(false);

  // Initialize user/profile in store for sessions coming from passwordless or refresh
  useEffect(() => {
    let isMounted = true;
    const initializeUserFromSession = async () => {
      // Always check if we need to fetch/refresh user profile data
      // This handles cases where user is authenticated but missing profile data
      try {
        setLoading(true);
        const supaUser = await authService.getCurrentUser();
        if (!supaUser) return;

        // Check if we already have complete user data
        const userRole = supaUser.user_metadata?.role || "sales_rep";
        const isDataComplete =
          isAuthenticated &&
          user?.id === supaUser.id &&
          // For farmers, ensure livestock_type is loaded
          ((userRole === "farmer" && user?.livestock_type !== undefined) ||
            // For sales reps, ensure company_id and territory_region are loaded
            (userRole === "sales_rep" &&
              user?.company_id !== undefined &&
              user?.territory_region !== undefined) ||
            // For other non-farmers, ensure company_id is loaded
            (userRole !== "farmer" &&
              userRole !== "sales_rep" &&
              user?.company_id !== undefined));

        if (isDataComplete) {
          // User data is already complete, no need to refetch
          return;
        }

        try {
          const profileData = await authService.getUserProfileById(supaUser.id);
          const merged = transformSupabaseUser(supaUser, profileData?.[0]);
          if (isMounted) setUser(merged);
        } catch {
          const merged = transformSupabaseUser(supaUser);
          if (isMounted) setUser(merged);
        }
      } finally {
        setLoading(false);
      }
    };
    void initializeUserFromSession();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.id, user?.company_id, setLoading, setUser]);

  useEffect(() => {
    // Show company setup modal if user is admin and has no company_id
    if (user?.role === "admin" && !user?.company_id) {
      setShowCompanySetup(true);
    } else {
      setShowCompanySetup(false);
    }
  }, [user]);

  const handleCloseCompanySetup = () => {
    setShowCompanySetup(false);
  };

  // Show loading while user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <Header />
      <div className="flex-1 min-h-0 p-4 container mx-auto">
        <Outlet />
      </div>

      <CompanySetupModal
        isOpen={showCompanySetup}
        onClose={handleCloseCompanySetup}
      />
    </div>
  );
}
