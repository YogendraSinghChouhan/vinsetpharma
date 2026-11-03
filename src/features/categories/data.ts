import "server-only";

import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { requireAdmin } from "@/features/auth/data";
import { products } from "@/features/products/schema";
import { deleteImage } from "@/features/storage/server/service";
import { type Category, categories } from "./schema";
import { isUniqueViolation, MAX_SLUG_RETRY_ATTEMPTS, slugify } from "./slug";
import type {
  CreateCategoryInput,
  ReorderCategoriesInput,
  UpdateCategoryInput,
} from "./validation";

export class CategoryInUseError extends Error {
  constructor(message = "Move or delete its products first.") {
    super(message);
    this.name = "CategoryInUseError";
  }
}

export interface CategoryWithProductCount extends Category {
  productCount: number;
}

export interface CategoryOption {
  id: string;
  name: string;
}

/**
 * Admin read query for all categories with the count of products referencing each.
 * Ordered by sortOrder ASC, createdAt ASC, id ASC for deterministic ties.
 */
export async function listCategories(): Promise<CategoryWithProductCount[]> {
  await requireAdmin();

  return db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      imageKey: categories.imageKey,
      sortOrder: categories.sortOrder,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
      productCount: sql<number>`COALESCE((SELECT COUNT(*)::int FROM ${products} WHERE ${products.categoryId} = ${categories.id}), 0)`,
    })
    .from(categories)
    .orderBy(
      asc(categories.sortOrder),
      asc(categories.createdAt),
      asc(categories.id),
    );
}

/**
 * Admin read query for a single category by ID.
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  await requireAdmin();

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  return category ?? null;
}

/**
 * Admin read query for lightweight category options { id, name } to populate product form selects.
 */
export async function listCategoryOptions(): Promise<CategoryOption[]> {
  await requireAdmin();

  return db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name));
}

/**
 * Admin mutation to create a new category.
 * - sortOrder assigned in single INSERT statement as COALESCE(MAX(sort_order), 0) + 1
 * - slug generated once, retried on Postgres 23505 unique violation with numeric suffix
 */
export async function createCategory(
  input: CreateCategoryInput,
): Promise<Category> {
  await requireAdmin();

  const baseSlug = slugify(input.name);
  let currentSlug = baseSlug;
  let attempts = 0;

  while (attempts <= MAX_SLUG_RETRY_ATTEMPTS) {
    try {
      const [created] = await db
        .insert(categories)
        .values({
          slug: currentSlug,
          name: input.name,
          imageKey: input.imageKey ?? null,
          sortOrder: sql`COALESCE((SELECT MAX(${categories.sortOrder}) FROM ${categories}), 0) + 1`,
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
 * Admin mutation to update category details.
 * - updates name and image only; slug never changes
 * - deletes old image from storage AFTER database update succeeds
 */
export async function updateCategory(
  input: UpdateCategoryInput,
): Promise<Category> {
  await requireAdmin();

  const [existing] = await db
    .select({
      id: categories.id,
      imageKey: categories.imageKey,
    })
    .from(categories)
    .where(eq(categories.id, input.id))
    .limit(1);

  if (!existing) {
    throw new Error("Category not found.");
  }

  const [updated] = await db
    .update(categories)
    .set({
      name: input.name,
      imageKey: input.imageKey ?? null,
    })
    .where(eq(categories.id, input.id))
    .returning();

  if (!updated) {
    throw new Error("Failed to update category.");
  }

  if (existing.imageKey && existing.imageKey !== input.imageKey) {
    try {
      await deleteImage(existing.imageKey);
    } catch {
      // Storage failure does not fail the database update
    }
  }

  return updated;
}

/**
 * Admin mutation to delete a category.
 * - refuses with CategoryInUseError when any product references the category
 * - deletes image from storage AFTER the database row is gone
 * - storage failures are ignored
 */
export async function deleteCategory(id: string): Promise<Category> {
  await requireAdmin();

  const [referencingProduct] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.categoryId, id))
    .limit(1);

  if (referencingProduct) {
    throw new CategoryInUseError("Move or delete its products first.");
  }

  let deleted: Category | undefined;
  try {
    const [row] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();
    deleted = row;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: unknown }).code === "23503"
    ) {
      throw new CategoryInUseError("Move or delete its products first.");
    }
    throw error;
  }

  if (!deleted) {
    throw new Error("Category not found.");
  }

  if (deleted.imageKey) {
    try {
      await deleteImage(deleted.imageKey);
    } catch {
      // Storage failure does not fail the delete action
    }
  }

  return deleted;
}

/**
 * Admin mutation to reorder categories.
 * Performs ONE atomic UPDATE statement using CASE assigning 1..n to sortOrder.
 */
export async function reorderCategories(
  input: ReorderCategoriesInput,
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
    UPDATE ${categories}
    SET sort_order = CASE ${categories.id}
      ${sql.join(cases, sql` `)}
    END,
    updated_at = NOW()
    WHERE ${categories.id} IN (${sql.join(idList, sql`, `)})
  `);
}
