import { defineRelationsPart } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export type HeroSlideFocus = "left" | "center" | "right";

export const heroSlides = pgTable(
  "hero_slides",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    imageKey: text("image_key").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    alt: text("alt"),
    focus: text("focus").$type<HeroSlideFocus>().notNull().default("center"),
    sortOrder: integer("sort_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("hero_slides_sort_order_idx").on(table.sortOrder)],
);

export type HeroSlide = typeof heroSlides.$inferSelect;
export type NewHeroSlide = typeof heroSlides.$inferInsert;

export const heroSlideRelations = defineRelationsPart(
  { heroSlides },
  () => ({}),
);
