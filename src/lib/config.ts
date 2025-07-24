export const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === "true";
export const DEV_MODE = import.meta.env.VITE_DEV_MODE === "true";
export const FIELD_IQ_API_URL = import.meta.env.VITE_FIELD_IQ_API_URL;

// Field IQ API Configuration (Python FastAPI backend)
export const FIELD_IQ_API_CONFIG = {
  baseUrl: import.meta.env.VITE_FIELD_IQ_API_URL || "http://localhost:8000",
  endpoints: {
    farmerDashboard: "/ViewModels/farmer-dashboard",
    // Add more endpoints as they become available
  },
} as const;

// Secret developer sign-up configuration
export const DEV_SIGNUP_CONFIG = {
  // Secret URL path for developer sign-up
  // Visit: /auth/dev-signup?key=ACCESS_KEY to access the secret developer sign-up page
  secretPath: "/auth/dev-signup",

  // Enable/disable the dev sign-up feature
  enabled: true,

  accessKey: import.meta.env.VITE_SUPER_ADMIN_ACCESS_KEY,
} as const;
