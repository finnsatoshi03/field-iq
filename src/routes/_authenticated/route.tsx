import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getDefaultDashboardRoute, hasRoutePermission } from "@/lib/rbac";
import { BYPASS_AUTH } from "@/lib/config";

import { useUserStore } from "@/store/user-store";
import { Header } from "@/components/custom/header";

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
    <div className="flex flex-col h-full min-h-0">
      <Header />
      <div className="flex-1 min-h-0 p-4 container mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
