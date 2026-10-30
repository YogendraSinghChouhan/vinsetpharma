import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/config/env";
import { authRelations } from "./schema";

export const db = drizzle({
  connection: env.DATABASE_URL,
  relations: { ...authRelations },
});

export type Database = typeof db;
