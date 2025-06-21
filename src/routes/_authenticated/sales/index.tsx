import { createFileRoute, redirect } from "@tanstack/react-router";
import { hasRoutePermission } from "@/lib/rbac";
import { BYPASS_AUTH } from "@/lib/config";

export const Route = createFileRoute("/_authenticated/sales/")({
  beforeLoad: ({ context }) => {
    if (BYPASS_AUTH) return;

    const authState = getAuthStateFromContext(context);

    if (authState.user && !hasRoutePermission(authState.user.role, "/sales")) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: SalesDashboard,
});

function SalesDashboard() {
  return <div>Sales</div>;
}

// Helper function to get auth state from context (placeholder)
function getAuthStateFromContext(context: any) {
  // In a real app, this would extract auth state from the router context
  // For now, we'll use the same localStorage approach
  console.log(context);

  try {
    const mockUser = localStorage.getItem("mockUser");
    if (mockUser) {
      const user = JSON.parse(mockUser);
      return { user };
    }
  } catch (error) {
    console.error("Error getting auth state:", error);
  }

  return { user: null };
}
