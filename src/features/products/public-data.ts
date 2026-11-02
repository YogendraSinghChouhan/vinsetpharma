import "server-only";

import { and, asc, count, eq, ne } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db/client";
import {
  FEATURED_PRODUCTS_LIMIT,
  PRODUCT_CACHE_TAGS,
  PUBLIC_PRODUCTS_PAGE_SIZE,
  RELATED_PRODUCTS_LIMIT,
} from "./constants";
import { products } from "./schema";

export type PublicProduct = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  imageKey: string;
};

const publicProductColumns = {
  id: products.id,
  slug: products.slug,
  title: products.title,
  tagline: products.tagline,
  description: products.description,
  imageKey: products.imageKey,
};

/**
 * Public paginated read query for published products.
 * Uses 'use cache' with list tag and 'days' cacheLife.
 */
export async function getPublishedProductsPage({
  page,
  pageSize = PUBLIC_PRODUCTS_PAGE_SIZE,
}: {
  page: number;
  pageSize?: number;
}): Promise<{
  items: PublicProduct[];
  totalItems: number;
  totalPages: number;
}> {
  "use cache";
  cacheTag(PRODUCT_CACHE_TAGS.list);
  cacheLife("days");

  const [{ total }] = await db
    .select({ total: count() })
    .from(products)
    .where(eq(products.published, true));

  const totalItems = Number(total ?? 0);
  const totalPages = Math.ceil(totalItems / pageSize);
  const offset = Math.max(0, (page - 1) * pageSize);

  const items = await db
    .select(publicProductColumns)
    .from(products)
    .where(eq(products.published, true))
    .orderBy(asc(products.sortOrder), asc(products.createdAt), asc(products.id))
    .limit(pageSize)
    .offset(offset);

  return {
    items,
    totalItems,
    totalPages,
  };
}

/**
 * Public read query for a single product by slug.
 * Tagged with both the per-slug tag and list tag for complete revalidation.
 */
export async function getPublishedProductBySlug(
  slug: string,
): Promise<PublicProduct | null> {
  "use cache";
  cacheTag(PRODUCT_CACHE_TAGS.bySlug(slug), PRODUCT_CACHE_TAGS.list);
  cacheLife("days");

  const [product] = await db
    .select(publicProductColumns)
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.published, true)))
    .limit(1);

  return product ?? null;
}

/**
 * Public read query for the first N published products.
 */
export async function getFeaturedProducts(
  limit: number = FEATURED_PRODUCTS_LIMIT,
): Promise<PublicProduct[]> {
  "use cache";
  cacheTag(PRODUCT_CACHE_TAGS.list);
  cacheLife("days");

  return db
    .select(publicProductColumns)
    .from(products)
    .where(eq(products.published, true))
    .orderBy(asc(products.sortOrder), asc(products.createdAt), asc(products.id))
    .limit(limit);
}

/**
 * Public read query for related products excluding the current product ID.
 */
export async function getRelatedProducts(
  excludeId: string,
  limit: number = RELATED_PRODUCTS_LIMIT,
): Promise<PublicProduct[]> {
  "use cache";
  cacheTag(PRODUCT_CACHE_TAGS.list);
  cacheLife("days");

  return db
    .select(publicProductColumns)
    .from(products)
    .where(and(eq(products.published, true), ne(products.id, excludeId)))
    .orderBy(asc(products.sortOrder), asc(products.createdAt), asc(products.id))
    .limit(limit);
}

/**
 * Public query returning published product slugs for static route generation.
 */
export async function getPublishedProductSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(PRODUCT_CACHE_TAGS.list);
  cacheLife("days");

  const rows = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.published, true))
    .orderBy(
      asc(products.sortOrder),
      asc(products.createdAt),
      asc(products.id),
    );

  return rows.map((r) => r.slug);
}

export type ProductSitemapItem = {
  slug: string;
  updatedAt: Date;
};

/**
 * Public query returning slug and updatedAt for sitemap generation.
 */
export async function getPublishedProductsForSitemap(): Promise<
  ProductSitemapItem[]
> {
  "use cache";
  cacheTag(PRODUCT_CACHE_TAGS.list);
  cacheLife("days");

  return db
    .select({
      slug: products.slug,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(eq(products.published, true))
    .orderBy(
      asc(products.sortOrder),
      asc(products.createdAt),
      asc(products.id),
    );
}
