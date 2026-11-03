import "server-only";

import { and, asc, count, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { buildReorderStatement } from "@/db/reorder";
import { requireAdmin } from "@/features/auth/data";
import { categories } from "@/features/categories/schema";
import { deleteImage } from "@/features/storage/server/service";
import { FEATURED_PRODUCTS_LIMIT } from "./constants";
import { type Product, products } from "./schema";
import { isUniqueViolation, MAX_SLUG_RETRY_ATTEMPTS, slugify } from "./slug";
import type {
  CreateProductInput,
  PublishToggleInput,
  ReorderProductsInput,
  SetProductFeaturedInput,
  UpdateProductInput,
} from "./validation";

export class ProductNotFoundError extends Error {
  readonly code = "not_found" as const;
  constructor(message = "Product not found.") {
    super(message);
    this.name = "ProductNotFoundError";
  }
}

export class ProductDraftFeaturedError extends Error {
  readonly code = "draft" as const;
  constructor(message = "Only published products can be featured.") {
    super(message);
    this.name = "ProductDraftFeaturedError";
  }
}

export class FeaturedLimitReachedError extends Error {
  readonly code = "limit_reached" as const;
  constructor(
    message = `You can feature up to ${FEATURED_PRODUCTS_LIMIT} products. Remove one first.`,
  ) {
    super(message);
    this.name = "FeaturedLimitReachedError";
  }
}

export type ProductListItem = Product & {
  categoryName: string | null;
};

/**
 * Admin read query for all products joined with their category name.
 * Ordered by sortOrder ASC, then createdAt ASC, then id ASC for deterministic ties.
 * Uncached request-time data (no 'use cache').
 */
export async function listProducts(): Promise<ProductListItem[]> {
  await requireAdmin();

  return db
    .select({
      id: products.id,
      slug: products.slug,
      title: products.title,
      tagline: products.tagline,
      description: products.description,
      imageKey: products.imageKey,
      categoryId: products.categoryId,
      sortOrder: products.sortOrder,
      published: products.published,
      featured: products.featured,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(
      asc(products.sortOrder),
      asc(products.createdAt),
      asc(products.id),
    );
}

/**
 * Admin query for count of published and featured products.
 */
export async function countFeaturedProducts(): Promise<number> {
  await requireAdmin();

  const [{ total }] = await db
    .select({ total: count() })
    .from(products)
    .where(and(eq(products.published, true), eq(products.featured, true)));

  return Number(total ?? 0);
}

/**
 * Admin read query for a single product by ID.
 * Uncached request-time data.
 */
export async function getProductById(id: string): Promise<Product | null> {
  await requireAdmin();

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  return product ?? null;
}

/**
 * Admin mutation to create a new product.
 * - verifies the selected category exists
 * - sortOrder assigned in single INSERT statement as COALESCE(MAX(sort_order), 0) + 1
 * - default published: false
 * - slug generated once, retried on Postgres 23505 unique violation with numeric suffix
 */
export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  await requireAdmin();

  const [category] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.id, input.categoryId))
    .limit(1);

  if (!category) {
    throw new Error("Selected category does not exist.");
  }

  const baseSlug = slugify(input.title);
  let currentSlug = baseSlug;
  let attempts = 0;

  while (attempts <= MAX_SLUG_RETRY_ATTEMPTS) {
    try {
      const [created] = await db
        .insert(products)
        .values({
          slug: currentSlug,
          title: input.title,
          tagline: input.tagline,
          description: input.description,
          imageKey: input.imageKey,
          categoryId: input.categoryId,
          sortOrder: sql`COALESCE((SELECT MAX(${products.sortOrder}) FROM ${products}), 0) + 1`,
          published: false,
        })
        .returning();

      if (created) {
        return created;
      }
    } catch (error: unknown) {
      if (isUniqueViolation(error) && attempts < MAX_SLUG_RETRY_ATTEMPTS) {
        attempts += 1;
        currentSlug = `${baseSlug}-${attempts + 1}`;
        continue;
      }
      throw error;
    }
    attempts += 1;
  }

  throw new Error(
    "Failed to generate a unique slug after maximum retry attempts.",
  );
}

/**
 * Admin mutation to update product details.
 * - verifies the selected category exists
 * - updates title, tagline, description, imageKey, categoryId (slug is never changed)
 * - deletes old image from storage AFTER database update succeeds
 */
export async function updateProduct(
  input: UpdateProductInput,
): Promise<Product> {
  await requireAdmin();

  const [category] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.id, input.categoryId))
    .limit(1);

  if (!category) {
    throw new Error("Selected category does not exist.");
  }

  const [existing] = await db
    .select({
      id: products.id,
      imageKey: products.imageKey,
    })
    .from(products)
    .where(eq(products.id, input.id))
    .limit(1);

  if (!existing) {
    throw new Error("Product not found.");
  }

  const [updated] = await db
    .update(products)
    .set({
      title: input.title,
      tagline: input.tagline,
      description: input.description,
      imageKey: input.imageKey,
      categoryId: input.categoryId,
    })
    .where(eq(products.id, input.id))
    .returning();

  if (!updated) {
    throw new Error("Failed to update product.");
  }

  // Delete previous image if image key was replaced
  if (existing.imageKey !== input.imageKey) {
    try {
      await deleteImage(existing.imageKey);
    } catch {
      // Deletion failure leaves an orphan image in S3, but database update is already committed
    }
  }

  return updated;
}

/**
 * Admin mutation to delete a product.
 * - deletes row first, then deletes image from storage
 * - storage failure does not fail the action
 */
export async function deleteProduct(id: string): Promise<Product> {
  await requireAdmin();

  const [deleted] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();

  if (!deleted) {
    throw new Error("Product not found.");
  }

  if (deleted.imageKey) {
    try {
      await deleteImage(deleted.imageKey);
    } catch {
      // Storage failure does not fail the delete action because DB row is already removed
    }
  }

  return deleted;
}

/**
 * Admin mutation to toggle product published state.
 * Unpublishing also sets featured = false in the same statement.
 */
export async function setProductPublished(
  input: PublishToggleInput,
): Promise<Product> {
  await requireAdmin();

  const [updated] = await db
    .update(products)
    .set({
      published: input.published,
      ...(input.published ? {} : { featured: false }),
    })
    .where(eq(products.id, input.id))
    .returning();

  if (!updated) {
    throw new ProductNotFoundError("Product not found.");
  }

  return updated;
}

/**
 * Admin mutation to set whether a product is featured on the home page.
 * - Turning ON is ONE atomic SQL statement: updates only if product is published
 *   AND current featured count is below FEATURED_PRODUCTS_LIMIT.
 * - If atomic update produces no rows, runs a follow-up query to return the specific typed error:
 *   not_found, draft, or limit_reached.
 * - Turning OFF is a simple update setting featured = false.
 */
export async function setProductFeatured(
  input: SetProductFeaturedInput,
): Promise<Product> {
  await requireAdmin();

  if (input.featured) {
    const [updated] = await db
      .update(products)
      .set({
        featured: true,
      })
      .where(
        and(
          eq(products.id, input.id),
          eq(products.published, true),
          sql`(SELECT COUNT(*)::int FROM ${products} WHERE ${products.featured} = true) < ${FEATURED_PRODUCTS_LIMIT}`,
        ),
      )
      .returning();

    if (updated) {
      return updated;
    }

    const [existing] = await db
      .select({
        id: products.id,
        published: products.published,
      })
      .from(products)
      .where(eq(products.id, input.id))
      .limit(1);

    if (!existing) {
      throw new ProductNotFoundError("Product not found.");
    }

    if (!existing.published) {
      throw new ProductDraftFeaturedError(
        "Only published products can be featured.",
      );
    }

    throw new FeaturedLimitReachedError(
      `You can feature up to ${FEATURED_PRODUCTS_LIMIT} products. Remove one first.`,
    );
  }

  const [updated] = await db
    .update(products)
    .set({ featured: false })
    .where(eq(products.id, input.id))
    .returning();

  if (!updated) {
    throw new ProductNotFoundError("Product not found.");
  }

  return updated;
}

/**
 * Admin mutation to reorder products.
 * Performs ONE atomic UPDATE statement using CASE assigning 1..n to sortOrder.
 */
export async function reorderProducts(
  input: ReorderProductsInput,
): Promise<void> {
  await requireAdmin();

  if (input.ids.length === 0) {
    return;
  }

  await db.execute(
    buildReorderStatement({
      table: products,
      ids: input.ids,
      refreshUpdatedAt: true,
    }),
  );
}
