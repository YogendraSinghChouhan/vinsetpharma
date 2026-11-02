import "server-only";

import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { requireAdmin } from "@/features/auth/data";
import { deleteImage } from "@/features/storage/server/service";
import { type Product, products } from "./schema";
import { isUniqueViolation, MAX_SLUG_RETRY_ATTEMPTS, slugify } from "./slug";
import type {
  CreateProductInput,
  PublishToggleInput,
  ReorderProductsInput,
  UpdateProductInput,
} from "./validation";

/**
 * Admin read query for all products.
 * Ordered by sortOrder ASC, then createdAt ASC, then id ASC for deterministic ties.
 * Uncached request-time data (no 'use cache').
 */
export async function listProducts(): Promise<Product[]> {
  await requireAdmin();

  return db
    .select()
    .from(products)
    .orderBy(
      asc(products.sortOrder),
      asc(products.createdAt),
      asc(products.id),
    );
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
 * - sortOrder assigned in single INSERT statement as COALESCE(MAX(sort_order), 0) + 1
 * - default published: false
 * - slug generated once, retried on Postgres 23505 unique violation with numeric suffix
 */
export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  await requireAdmin();

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
 * - updates title, tagline, description, imageKey only (slug is never changed)
 * - deletes old image from storage AFTER database update succeeds
 */
export async function updateProduct(
  input: UpdateProductInput,
): Promise<Product> {
  await requireAdmin();

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
 */
export async function setProductPublished(
  input: PublishToggleInput,
): Promise<Product> {
  await requireAdmin();

  const [updated] = await db
    .update(products)
    .set({ published: input.published })
    .where(eq(products.id, input.id))
    .returning();

  if (!updated) {
    throw new Error("Product not found.");
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

  const cases = input.ids.map(
    (id, index) => sql`WHEN ${id}::uuid THEN ${index + 1}`,
  );

  const idList = input.ids.map((id) => sql`${id}::uuid`);

  await db.execute(sql`
    UPDATE ${products}
    SET sort_order = CASE ${products.id}
      ${sql.join(cases, sql` `)}
    END,
    updated_at = NOW()
    WHERE ${products.id} IN (${sql.join(idList, sql`, `)})
  `);
}
