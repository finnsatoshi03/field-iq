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
    console.log("🔍 [AUTH ROUTE] beforeLoad called for:", location.pathname);
    console.log("🔍 [AUTH ROUTE] Full location:", location);

    if (BYPASS_AUTH) {
      console.log("🔍 [AUTH ROUTE] BYPASS_AUTH is true, skipping auth check");
      return;
    }

    // Special handling for invite route - allow access even without session
    // since the invite flow will handle setting up the session
    if (location.pathname === "/invite") {
      console.log(
        "🔍 [AUTH ROUTE] Invite route detected, allowing access without session check",
      );
      return;
    }

    try {
      console.log("🔍 [AUTH ROUTE] Checking auth state from Supabase...");
      // Check auth state directly from Supabase instead of Zustand store
      const user = await authService.getCurrentUser();
      console.log(
        "🔍 [AUTH ROUTE] Current user:",
        user?.email,
        "Role:",
        user?.user_metadata?.role,
      );

      if (!user) {
        console.log("🔍 [AUTH ROUTE] No user found, redirecting to sign-in");
        throw redirect({
          to: "/auth/sign-in",
          search: {
            redirect: location.href,
          },
        });
      }

      // Skip permission check for invite route - users need to complete invite flow
      const currentPath = location.pathname;
      console.log("🔍 [AUTH ROUTE] Current path:", currentPath);

      if (currentPath !== "/invite") {
        console.log(
          "🔍 [AUTH ROUTE] Not invite route, checking permissions...",
        );
        const userRole = user.user_metadata?.role || "sales_rep";
        const hasPermission = hasRoutePermission(userRole, currentPath);
        console.log(
          "🔍 [AUTH ROUTE] User role:",
          userRole,
          "Has permission:",
          hasPermission,
        );

        if (!hasPermission) {
          console.log(
            "🔍 [AUTH ROUTE] No permission, redirecting to dashboard",
          );
          // Redirect to their appropriate dashboard
          const defaultRoute = getDefaultDashboardRoute(userRole);
          console.log("🔍 [AUTH ROUTE] Redirecting to:", defaultRoute);
          throw redirect({
            to: defaultRoute,
          });
        }
      } else {
        console.log("🔍 [AUTH ROUTE] Invite route - skipping permission check");
      }

      console.log("🔍 [AUTH ROUTE] Auth check passed, allowing access");
    } catch (error) {
      console.log("🔍 [AUTH ROUTE] Error in auth check:", error);
      // If any error occurs (including auth errors), redirect to sign-in
      if (error && typeof error === "object" && "to" in error) {
        console.log("🔍 [AUTH ROUTE] Re-throwing redirect error");
        throw error; // Re-throw redirect errors
      }
      console.log("🔍 [AUTH ROUTE] Non-redirect error, redirecting to sign-in");
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

  console.log(
    "🏠 [AUTH LAYOUT] Component rendered - isAuthenticated:",
    isAuthenticated,
    "user:",
    user?.email,
  );

  // Initialize user/profile in store for sessions coming from passwordless or refresh
  useEffect(() => {
    console.log(
      "🏠 [AUTH LAYOUT] useEffect triggered - isAuthenticated:",
      isAuthenticated,
    );
    let isMounted = true;
    const initializeUserFromSession = async () => {
      if (isAuthenticated) {
        console.log(
          "🏠 [AUTH LAYOUT] User already authenticated, skipping initialization",
        );
        return;
      }
      try {
        console.log("🏠 [AUTH LAYOUT] Initializing user from session...");
        setLoading(true);
        const supaUser = await authService.getCurrentUser();
        console.log("🏠 [AUTH LAYOUT] Supabase user:", supaUser?.email);
        if (!supaUser) return;
        try {
          const profileData = await authService.getUserProfileById(supaUser.id);
          const merged = transformSupabaseUser(supaUser, profileData?.[0]);
          console.log(
            "🏠 [AUTH LAYOUT] Setting merged user with profile:",
            merged.email,
          );
          if (isMounted) setUser(merged);
        } catch {
          const merged = transformSupabaseUser(supaUser);
          console.log(
            "🏠 [AUTH LAYOUT] Setting merged user without profile:",
            merged.email,
          );
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
