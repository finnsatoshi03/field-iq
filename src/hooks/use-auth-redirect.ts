import { redirect } from "@tanstack/react-router";
import { useUserStore } from "@/store/user-store";
import { getDefaultDashboardRoute } from "@/lib/rbac";
import { BYPASS_AUTH } from "@/lib/config";

/**
 * Hook to redirect authenticated users away from public auth routes
 * This improves UX by preventing logged-in users from seeing login/signup pages
 */
export const useAuthRedirect = () => {
  // Skip auth redirect if auth is bypassed
  if (BYPASS_AUTH) return;

  const { isAuthenticated, user } = useUserStore.getState();

  if (isAuthenticated && user) {
    // Redirect to their appropriate dashboard
    const defaultRoute = getDefaultDashboardRoute(user.role);
    throw redirect({
      to: defaultRoute,
    });
  }
};

/**
 * Function version for use in route beforeLoad
 */
export const checkAuthRedirect = () => {
  // Skip auth redirect if auth is bypassed
  if (BYPASS_AUTH) return;

  const { isAuthenticated, user } = useUserStore.getState();

  if (isAuthenticated && user) {
    // Redirect to their appropriate dashboard
    const defaultRoute = getDefaultDashboardRoute(user.role);
    throw redirect({
      to: defaultRoute,
    });
  }
};
