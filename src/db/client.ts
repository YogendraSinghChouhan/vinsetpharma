import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/config/env";
import {
  authRelations,
  blogRelations,
  productRelations,
  quoteRelations,
} from "./schema";

export const db = drizzle({
  connection: env.DATABASE_URL,
  relations: {
    ...productRelations,
    ...quoteRelations,
    ...blogRelations,
    ...authRelations,
  },
});

export type Database = typeof db;
