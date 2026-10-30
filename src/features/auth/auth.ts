import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { env } from "@/config/env";
import { db } from "@/db/client";
import * as schema from "./schema";

export const auth = betterAuth({
  appName: "Vinsent Pharma",
  baseURL: env.APP_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    customRules: { "/sign-in/email": { window: 60, max: 5 } },
  },
  session: { expiresIn: 60 * 60 * 24, updateAge: 60 * 60 },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
