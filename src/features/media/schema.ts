import { defineRelationsPart } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export type MediaType = "image" | "video";

export const media = pgTable(
  "media",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: text("type").$type<MediaType>().notNull(),
    fileKey: text("file_key").notNull(),
    posterKey: text("poster_key"),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    durationSeconds: integer("duration_seconds"),
    caption: text("caption"),
    sortOrder: integer("sort_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("media_sort_order_idx").on(table.sortOrder)],
);

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;

export const mediaRelations = defineRelationsPart({ media }, () => ({}));
