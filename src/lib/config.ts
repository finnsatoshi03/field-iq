export const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === "true";
export const DEV_MODE = import.meta.env.VITE_DEV_MODE === "true";

// Secret developer sign-up configuration
export const DEV_SIGNUP_CONFIG = {
  // Secret URL path for developer sign-up
  // Visit: /auth/dev-signup?key=ACCESS_KEY to access the secret developer sign-up page
  secretPath: "/auth/dev-signup",

  // Enable/disable the dev sign-up feature
  enabled: true,

  accessKey: import.meta.env.VITE_SUPER_ADMIN_ACCESS_KEY,
} as const;
