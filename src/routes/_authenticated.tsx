import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { hasRoutePermission } from "../lib/rbac";
import { BYPASS_AUTH } from "@/lib/config";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    if (BYPASS_AUTH) return;

    const authState = getAuthState();

    if (!authState.isAuthenticated || !authState.user) {
      throw redirect({
        to: "/auth/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }

    // Check if user has permission to access the current route
    const currentPath = location.pathname;
    const hasPermission = hasRoutePermission(authState.user.role, currentPath);

    if (!hasPermission) {
      // Redirect to their appropriate dashboard
      const defaultRoute = getDefaultDashboardForRole(authState.user.role);
      throw redirect({
        to: defaultRoute,
        search: {
          error: "access_denied",
          message: `You don't have permission to access ${currentPath}`,
        },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  //   const { user, signOut } = useAuth();

  // Mock user for development when bypassing auth
  //   const mockUser = {
  //     name: "Development User",
  //     role: "admin", // Change this to test different roles: 'admin', 'sales_rep', 'farmer'
  //   };

  //   const displayUser = user || mockUser;

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}

// Helper function to get auth state (in real app, this would come from context)
function getAuthState() {
  // This is a temporary implementation - in a real app you'd get this from your auth context
  // For development, we'll check if there's a mock user in localStorage or use the auth context

  try {
    const mockUser = localStorage.getItem("mockUser");
    if (mockUser) {
      const user = JSON.parse(mockUser);
      return {
        isAuthenticated: true,
        user,
      };
    }
  } catch (error) {
    console.error("Error parsing mock user from localStorage:", error);
  }

  // Fallback - no user found
  return {
    isAuthenticated: false,
    user: null,
  };
}

// Helper function to get default dashboard route for a role
function getDefaultDashboardForRole(role: string): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "sales_rep":
      return "/sales";
    case "farmer":
      return "/farmer";
    default:
      return "/";
  }
}
