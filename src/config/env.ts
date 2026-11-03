import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z
      .url()
      .refine(
        (value) =>
          ["postgres:", "postgresql:"].includes(new URL(value).protocol),
        "Must be a PostgreSQL connection URL",
      ),
    BETTER_AUTH_SECRET: z.string().min(32),
    APP_URL: z
      .url()
      .refine(
        (value) => ["http:", "https:"].includes(new URL(value).protocol),
        "Must be an HTTP(S) URL",
      ),
    S3_ENDPOINT: z.url().optional(),
    S3_REGION: z.string().min(1),
    S3_BUCKET: z.string().min(1),
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    S3_PUBLIC_URL: z.url(),
    RESEND_API_KEY: z.string().min(1),
    QUOTE_NOTIFICATION_EMAIL: z.string().email(),
    QUOTE_FROM_EMAIL: z.string().email(),
  },
  client: {
    NEXT_PUBLIC_S3_PUBLIC_URL: z.url().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_S3_PUBLIC_URL: process.env.NEXT_PUBLIC_S3_PUBLIC_URL,
  },
  emptyStringAsUndefined: true,
});
