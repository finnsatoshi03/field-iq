import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getDefaultDashboardRoute, hasRoutePermission } from "@/lib/rbac";
import { BYPASS_AUTH } from "@/lib/config";

import { useUserStore } from "@/store/user-store";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    if (BYPASS_AUTH) return;

    // Get auth state from Zustand store
    const { isAuthenticated, user } = useUserStore.getState();

    if (!isAuthenticated || !user) {
      throw redirect({
        to: "/auth/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }

    // Check if user has permission to access the current route
    const currentPath = location.pathname;
    const hasPermission = hasRoutePermission(user.role, currentPath);

    if (!hasPermission) {
      // Redirect to their appropriate dashboard
      const defaultRoute = getDefaultDashboardRoute(user.role);
      throw redirect({
        to: defaultRoute,
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}
