import { loadEnvConfig } from "@next/env";
import { createEnv } from "@t3-oss/env-nextjs";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "./constants";

loadEnvConfig(process.cwd());
const { env } = await import("@/config/env");
const { db } = await import("@/db/client");
const { user, account, session } = await import("./schema");

const resetEnv = createEnv({
  extends: [env],
  server: {
    ADMIN_EMAIL: z.string().email(),
    ADMIN_NEW_PASSWORD: z.string().min(MIN_PASSWORD_LENGTH),
  },
  experimental__runtimeEnv: {},
  emptyStringAsUndefined: true,
});

const targetEmail = resetEnv.ADMIN_EMAIL.toLowerCase();

const [existingUser] = await db
  .select({ id: user.id })
  .from(user)
  .where(eq(user.email, targetEmail))
  .limit(1);

if (!existingUser) {
  throw new Error(`No admin account found with email: ${targetEmail}`);
}

const hashedPassword = await hashPassword(resetEnv.ADMIN_NEW_PASSWORD);

await db.batch([
  db
    .update(account)
    .set({
      password: hashedPassword,
      updatedAt: new Date(),
    })
    .where(eq(account.userId, existingUser.id)),
  db.delete(session).where(eq(session.userId, existingUser.id)),
]);

console.info(
  `Admin password successfully reset for ${targetEmail}. All active sessions have been invalidated. Remember to remove ADMIN_NEW_PASSWORD from your environment.`,
);
