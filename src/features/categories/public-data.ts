import "server-only";

import { and, asc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db/client";
import type { PublicProduct } from "@/features/products/public-data";
import { products } from "@/features/products/schema";
import { CATEGORY_CACHE_TAGS } from "./constants";
import { categories } from "./schema";

export type PublicCategory = {
  id: string;
  slug: string;
  name: string;
  imageKey: string | null;
  productCount: number;
};

/**
 * Public read query for all product categories.
 * Ordered by sortOrder ASC, createdAt ASC, id ASC.
 * Includes count of published products and falls back to first published product image
 * if category imageKey is null.
 * Uses 'use cache' with list tag and 'days' cacheLife.
 */
export async function getPublicCategories(): Promise<PublicCategory[]> {
  "use cache";
  cacheTag(CATEGORY_CACHE_TAGS.list);
  cacheLife("days");

  const rows = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      imageKey: sql<
        string | null
      >`COALESCE(${categories.imageKey}, (SELECT ${products.imageKey} FROM ${products} WHERE ${products.categoryId} = ${categories.id} AND ${products.published} = true ORDER BY ${products.sortOrder} ASC, ${products.createdAt} ASC, ${products.id} ASC LIMIT 1))`,
      productCount: sql<number>`COALESCE((SELECT COUNT(*)::int FROM ${products} WHERE ${products.categoryId} = ${categories.id} AND ${products.published} = true), 0)`,
    })
    .from(categories)
    .orderBy(
      asc(categories.sortOrder),
      asc(categories.createdAt),
      asc(categories.id),
    );

  return rows;
}

/**
 * Public read query for a single category by slug.
 */
export async function getPublicCategoryBySlug(
  slug: string,
): Promise<PublicCategory | null> {
  "use cache";
  cacheTag(CATEGORY_CACHE_TAGS.bySlug(slug), CATEGORY_CACHE_TAGS.list);
  cacheLife("days");

  const [row] = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      imageKey: sql<
        string | null
      >`COALESCE(${categories.imageKey}, (SELECT ${products.imageKey} FROM ${products} WHERE ${products.categoryId} = ${categories.id} AND ${products.published} = true ORDER BY ${products.sortOrder} ASC, ${products.createdAt} ASC, ${products.id} ASC LIMIT 1))`,
      productCount: sql<number>`COALESCE((SELECT COUNT(*)::int FROM ${products} WHERE ${products.categoryId} = ${categories.id} AND ${products.published} = true), 0)`,
    })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  return row ?? null;
}

/**
 * Public read query for all published products in a specific category.
 */
export async function getPublishedProductsForCategory(
  categoryId: string,
): Promise<PublicProduct[]> {
  "use cache";
  cacheTag(CATEGORY_CACHE_TAGS.list);
  cacheLife("days");

  return db
    .select({
      id: products.id,
      slug: products.slug,
      title: products.title,
      tagline: products.tagline,
      description: products.description,
      imageKey: products.imageKey,
    })
    .from(products)
    .where(
      and(eq(products.categoryId, categoryId), eq(products.published, true)),
    )
    .orderBy(
      asc(products.sortOrder),
      asc(products.createdAt),
      asc(products.id),
    );
}

/**
 * Public query returning published category slugs for static route generation.
 */
export async function getPublishedCategorySlugs(): Promise<string[]> {
  "use cache";
  cacheTag(CATEGORY_CACHE_TAGS.list);
  cacheLife("days");

  const rows = await db
    .select({ slug: categories.slug })
    .from(categories)
    .orderBy(
      asc(categories.sortOrder),
      asc(categories.createdAt),
      asc(categories.id),
    );

  return rows.map((r) => r.slug);
}
