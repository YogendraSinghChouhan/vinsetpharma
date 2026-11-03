import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/config/env";
import {
  authRelations,
  blogRelations,
  categoryRelations,
  mediaRelations,
  productRelations,
  quoteRelations,
} from "./schema";

export const db = drizzle({
  connection: env.DATABASE_URL,
  relations: {
    ...categoryRelations,
    ...productRelations,
    ...quoteRelations,
    ...blogRelations,
    ...authRelations,
    ...mediaRelations,
  },
});

export type Database = typeof db;
