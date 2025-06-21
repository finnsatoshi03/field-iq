export const BYPASS_AUTH = true;
export const DEV_MODE = true;

// Secret developer sign-up configuration
export const DEV_SIGNUP_CONFIG = {
  // Secret URL path for developer sign-up
  // Visit: /auth/dev-signup?key=ACCESS_KEY to access the secret developer sign-up page
  secretPath: "/auth/dev-signup",

  // Enable/disable the dev sign-up feature
  enabled: true,

  // Secret access key - Generate a new one for production!
  // Usage: /auth/dev-signup?key=fiq_dev_2024_secure_7x9kL2mP8qR3nB5vX
  accessKey: "fiq_dev_2024_secure_7x9kL2mP8qR3nB5vX",
} as const;
