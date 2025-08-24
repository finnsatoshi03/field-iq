import { BYPASS_AUTH } from "@/lib/config";
import { getDefaultDashboardRoute } from "@/lib/rbac";
import { useUserStore } from "@/store/user-store";
import { redirect } from "@tanstack/react-router";

/**
 * Hook to redirect authenticated users away from public auth routes
 * This improves UX by preventing logged-in users from seeing login/signup pages
 */
export const useAuthRedirect = (currentPath?: string) => {
  // Skip auth redirect if auth is bypassed
  if (BYPASS_AUTH) return;

  // Skip redirect if user is on invite route (they need to complete the invite flow)
  if (currentPath === "/invite" || currentPath?.startsWith("/invite#")) {
    return;
  }

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
export const checkAuthRedirect = (currentPath?: string) => {
  // Skip auth redirect if auth is bypassed
  if (BYPASS_AUTH) return;

  // Skip redirect if user is on invite route (they need to complete the invite flow)
  if (currentPath === "/invite" || currentPath?.startsWith("/invite#")) {
    return;
  }

  const { isAuthenticated, user } = useUserStore.getState();

  if (isAuthenticated && user) {
    // Redirect to their appropriate dashboard
    const defaultRoute = getDefaultDashboardRoute(user.role);
    throw redirect({
      to: defaultRoute,
    });
  }
};
