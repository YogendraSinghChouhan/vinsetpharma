import "server-only";

import { and, asc, count, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db/client";
import {
  BLOG_CACHE_TAGS,
  HOME_LATEST_POSTS_LIMIT,
  PUBLIC_POSTS_PAGE_SIZE,
} from "./constants";
import { posts } from "./schema";

export type PublicPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  coverImageKey: string;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

const publicPostColumns = {
  id: posts.id,
  slug: posts.slug,
  title: posts.title,
  content: posts.content,
  coverImageKey: posts.coverImageKey,
  seoTitle: posts.seoTitle,
  seoDescription: posts.seoDescription,
  publishedAt: posts.publishedAt,
  updatedAt: posts.updatedAt,
};

/**
 * Public paginated read query for published blog posts.
 * Ordered by publishedAt desc, then id asc.
 * Uses 'use cache' with list tag and 'days' cacheLife.
 * Gracefully returns an empty list if the database is unmigrated at build time.
 */
export async function getPublishedPostsPage({
  page,
  pageSize = PUBLIC_POSTS_PAGE_SIZE,
}: {
  page: number;
  pageSize?: number;
}): Promise<{
  items: PublicPost[];
  totalItems: number;
  totalPages: number;
}> {
  "use cache";
  cacheTag(BLOG_CACHE_TAGS.list);
  cacheLife("days");

  const [{ total }] = await db
    .select({ total: count() })
    .from(posts)
    .where(eq(posts.published, true));

  const totalItems = Number(total ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const offset = Math.max(0, (page - 1) * pageSize);

  const items = await db
    .select(publicPostColumns)
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt), asc(posts.id))
    .limit(pageSize)
    .offset(offset);

  return {
    items,
    totalItems,
    totalPages,
  };
}

/**
 * Public read query for a single blog post by slug.
 * Tagged with per-slug tag AND list tag.
 * Gracefully returns null if the database is unmigrated or post not found.
 */
export async function getPublishedPostBySlug(
  slug: string,
): Promise<PublicPost | null> {
  "use cache";
  cacheTag(BLOG_CACHE_TAGS.bySlug(slug), BLOG_CACHE_TAGS.list);
  cacheLife("days");

  const [post] = await db
    .select(publicPostColumns)
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)))
    .limit(1);

  return post ?? null;
}

/**
 * Public read query for latest published posts (e.g. for homepage).
 */
export async function getLatestPosts(
  limit: number = HOME_LATEST_POSTS_LIMIT,
): Promise<PublicPost[]> {
  "use cache";
  cacheTag(BLOG_CACHE_TAGS.list);
  cacheLife("days");

  return db
    .select(publicPostColumns)
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt), asc(posts.id))
    .limit(limit);
}

/**
 * Public read query returning published post slugs for static generation.
 */
export async function getPublishedPostSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(BLOG_CACHE_TAGS.list);
  cacheLife("days");

  const rows = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt), asc(posts.id));

  return rows.map((r) => r.slug);
}

export type PostSitemapItem = {
  slug: string;
  updatedAt: Date;
};

/**
 * Public query returning slug and updatedAt for sitemap generation.
 */
export async function getPublishedPostsForSitemap(): Promise<
  PostSitemapItem[]
> {
  "use cache";
  cacheTag(BLOG_CACHE_TAGS.list);
  cacheLife("days");

  return db
    .select({
      slug: posts.slug,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt), asc(posts.id));
}
