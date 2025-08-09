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
    if (BYPASS_AUTH) return;

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

      // Check if user has permission to access the current route
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
      if (isAuthenticated) return;
      try {
        setLoading(true);
        const supaUser = await authService.getCurrentUser();
        if (!supaUser) return;
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
  }, [isAuthenticated, setLoading, setUser]);

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
