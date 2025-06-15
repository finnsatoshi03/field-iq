import type { UserRole } from "./types";

// Define role hierarchy and permissions
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  sales_rep: 2,
  farmer: 1,
};

// Define which roles can access which routes
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/admin": ["admin"],
  "/sales": ["sales_rep"],
  "/farmer": ["farmer"],
};

/**
 * Check if a user role has permission to access a specific route
 */
export const hasRoutePermission = (
  userRole: UserRole,
  routePath: string
): boolean => {
  const allowedRoles = ROUTE_PERMISSIONS[routePath];

  if (!allowedRoles) {
    // If route is not in permissions map, allow access (public route)
    return true;
  }

  return allowedRoles.includes(userRole);
};

/**
 * Check if a user role has higher or equal hierarchy level than required role
 */
export const hasRoleHierarchy = (
  userRole: UserRole,
  requiredRole: UserRole
): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

/**
 * Get the default dashboard route for a user role
 */
export const getDefaultDashboardRoute = (role: UserRole): string => {
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
};

/**
 * Get user-friendly role name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "Administrator";
    case "sales_rep":
      return "Sales Representative";
    case "farmer":
      return "Farmer";
    default:
      return "User";
  }
};
