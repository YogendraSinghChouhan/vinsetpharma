import { loadEnvConfig } from "@next/env";
import { createEnv } from "@t3-oss/env-nextjs";
import { hashPassword } from "better-auth/crypto";
import { z } from "zod";

loadEnvConfig(process.cwd());
const { env } = await import("@/config/env");
const { db } = await import("@/db/client");
const { user, account } = await import("./schema");

const seed = createEnv({
  extends: [env],
  server: {
    ADMIN_EMAIL: z.email(),
    ADMIN_PASSWORD: z.string().min(12),
    ADMIN_NAME: z.string().trim().min(1),
  },
  experimental__runtimeEnv: {},
  emptyStringAsUndefined: true,
});

const existing = await db.select({ id: user.id }).from(user).limit(1);
if (existing.length > 0) {
  throw new Error(
    "An admin already exists. Seeding is only for the initial account.",
  );
}

const id = crypto.randomUUID();
await db.batch([
  db.insert(user).values({
    id,
    name: seed.ADMIN_NAME,
    email: seed.ADMIN_EMAIL.toLowerCase(),
    emailVerified: true,
  }),
  db.insert(account).values({
    id: crypto.randomUUID(),
    userId: id,
    accountId: id,
    providerId: "credential",
    password: await hashPassword(seed.ADMIN_PASSWORD),
    updatedAt: new Date(),
  }),
]);
console.info(
  "Initial admin seeded. Remove ADMIN_PASSWORD from your environment.",
);
