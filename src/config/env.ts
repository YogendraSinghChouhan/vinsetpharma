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
  },
  experimental__runtimeEnv: {},
  emptyStringAsUndefined: true,
});
