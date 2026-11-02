import { defineRelationsPart } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { products } from "@/features/products/schema";

export const QUOTE_STATUSES = ["new", "contacted"] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const quoteRequests = pgTable(
  "quote_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    productTitle: text("product_title").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    message: text("message").notNull(),
    status: text("status", { enum: QUOTE_STATUSES }).notNull().default("new"),
    emailSentAt: timestamp("email_sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("quote_requests_status_created_at_idx").on(
      table.status,
      table.createdAt,
    ),
  ],
);

export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type NewQuoteRequest = typeof quoteRequests.$inferInsert;

export const quoteRelations = defineRelationsPart(
  { quoteRequests, products },
  (r) => ({
    quoteRequests: {
      product: r.one.products({
        from: r.quoteRequests.productId,
        to: r.products.id,
      }),
    },
  }),
);
