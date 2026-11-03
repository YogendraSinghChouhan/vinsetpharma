import { defineRelationsPart } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { categories } from "@/features/categories/schema";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    tagline: text("tagline").notNull(),
    description: text("description").notNull(),
    imageKey: text("image_key").notNull(),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "restrict",
    }),
    sortOrder: integer("sort_order").notNull(),
    published: boolean("published").default(false).notNull(),
    featured: boolean("featured").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("products_published_sort_order_idx").on(
      table.published,
      table.sortOrder,
    ),
    index("products_category_published_sort_order_idx").on(
      table.categoryId,
      table.published,
      table.sortOrder,
    ),
  ],
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const productRelations = defineRelationsPart(
  { products, categories },
  (r) => ({
    products: {
      category: r.one.categories({
        from: r.products.categoryId,
        to: r.categories.id,
      }),
    },
  }),
);
