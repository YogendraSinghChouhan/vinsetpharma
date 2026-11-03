import { SITE_NAME } from "@/config/site";

export const ADMIN_AUTH_COPY = {
  title: "Admin Sign In",
  description: `Enter your administrator credentials to access the ${SITE_NAME} management dashboard.`,
  emailLabel: "Email",
  emailPlaceholder: "Email address",
  passwordLabel: "Password",
  passwordPlaceholder: "Password",
  submitButton: "Sign In",
  submittingButton: "Signing in...",
  genericError: "Invalid email or password",
  rateLimitError: "Too many attempts, try again in a minute",
  networkError:
    "A network error occurred. Please check your connection and try again.",
} as const;
