import "server-only";

import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { requireAdmin } from "@/features/auth/data";
import { products } from "@/features/products/schema";
import { ADMIN_QUOTES_PAGE_SIZE } from "./constants";
import { type QuoteRequest, type QuoteStatus, quoteRequests } from "./schema";
import type { UpdateQuoteStatusInput } from "./validation";

export type QuoteRequestListItem = {
  id: string;
  productTitle: string;
  name: string;
  email: string;
  status: QuoteStatus;
  emailSentAt: Date | null;
  createdAt: Date;
};

export type QuoteRequestDetail = QuoteRequest & {
  productSlug: string | null;
  productPublished: boolean | null;
};

// ==========================================
// Public Data Operations (No Admin Auth)
// ==========================================

export type CreateQuoteRequestInput = {
  productId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

/**
 * Public insert for a quote request.
 * Verifies that the referenced product exists and is published,
 * snapshots its current title into productTitle, and stores the request.
 */
export async function createQuoteRequest(
  input: CreateQuoteRequestInput,
): Promise<QuoteRequest> {
  const [product] = await db
    .select({
      id: products.id,
      title: products.title,
    })
    .from(products)
    .where(and(eq(products.id, input.productId), eq(products.published, true)))
    .limit(1);

  if (!product) {
    throw new Error("Product not found or is no longer available.");
  }

  const [created] = await db
    .insert(quoteRequests)
    .values({
      productId: product.id,
      productTitle: product.title,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
      status: "new",
      emailSentAt: null,
    })
    .returning();

  if (!created) {
    throw new Error("Failed to record quote request.");
  }

  return created;
}

/**
 * Internal mutation called after the notification email is dispatched.
 */
export async function markQuoteEmailSent(id: string): Promise<void> {
  await db
    .update(quoteRequests)
    .set({ emailSentAt: new Date() })
    .where(eq(quoteRequests.id, id));
}

// ==========================================
// Admin Data Operations (requireAdmin Guarded)
// ==========================================

/**
 * Admin read query for paginated quote requests.
 * Ordered by createdAt DESC (newest first).
 */
export async function listQuoteRequests({
  page,
  pageSize = ADMIN_QUOTES_PAGE_SIZE,
}: {
  page: number;
  pageSize?: number;
}): Promise<{
  items: QuoteRequestListItem[];
  totalItems: number;
  totalPages: number;
}> {
  await requireAdmin();

  const [{ total }] = await db.select({ total: count() }).from(quoteRequests);

  const totalItems = Number(total ?? 0);
  const totalPages = Math.ceil(totalItems / pageSize);
  const offset = Math.max(0, (page - 1) * pageSize);

  const items = await db
    .select({
      id: quoteRequests.id,
      productTitle: quoteRequests.productTitle,
      name: quoteRequests.name,
      email: quoteRequests.email,
      status: quoteRequests.status,
      emailSentAt: quoteRequests.emailSentAt,
      createdAt: quoteRequests.createdAt,
    })
    .from(quoteRequests)
    .orderBy(desc(quoteRequests.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    items,
    totalItems,
    totalPages,
  };
}

/**
 * Admin read query for a single quote request by ID, joining product info.
 */
export async function getQuoteRequestById(
  id: string,
): Promise<QuoteRequestDetail | null> {
  await requireAdmin();

  const [quote] = await db
    .select({
      id: quoteRequests.id,
      productId: quoteRequests.productId,
      productTitle: quoteRequests.productTitle,
      name: quoteRequests.name,
      email: quoteRequests.email,
      phone: quoteRequests.phone,
      message: quoteRequests.message,
      status: quoteRequests.status,
      emailSentAt: quoteRequests.emailSentAt,
      createdAt: quoteRequests.createdAt,
      productSlug: products.slug,
      productPublished: products.published,
    })
    .from(quoteRequests)
    .leftJoin(products, eq(quoteRequests.productId, products.id))
    .where(eq(quoteRequests.id, id))
    .limit(1);

  return quote ?? null;
}

/**
 * Admin mutation to update the review status of a quote request.
 */
export async function setQuoteStatus(
  input: UpdateQuoteStatusInput,
): Promise<QuoteRequest> {
  await requireAdmin();

  const [updated] = await db
    .update(quoteRequests)
    .set({ status: input.status })
    .where(eq(quoteRequests.id, input.id))
    .returning();

  if (!updated) {
    throw new Error("Quote request not found.");
  }

  return updated;
}
