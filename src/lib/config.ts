export const BYPASS_AUTH = false;
export const DEV_MODE = false;

// Auth bypass configurations for development
export const AUTH_BYPASS_CONFIG = {
  // Set to true to completely bypass authentication
  enabled: false,

  // Bypass scenarios
  scenarios: {
    // Bypass with authenticated user
    withUser: {
      id: "dev-user-1",
      email: "dev@fieldiq.com",
      name: "Development User",
      role: "sales_rep" as const,
      isEmailVerified: true,
    },

    // Bypass with admin user
    withAdmin: {
      id: "dev-admin-1",
      email: "admin@fieldiq.com",
      name: "Admin User",
      role: "admin" as const,
      isEmailVerified: true,
    },

    // Bypass with farmer user
    withFarmer: {
      id: "dev-farmer-1",
      email: "farmer@fieldiq.com",
      name: "Farmer User",
      role: "farmer" as const,
      isEmailVerified: true,
    },
  },

  // Current active scenario - change this to test different user types
  // Options: 'withUser', 'withAdmin', 'withFarmer', or null for no user
  activeScenario: "withUser" as "withUser" | "withAdmin" | "withFarmer" | null,
} as const;
