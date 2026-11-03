import "server-only";

import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { requireAdmin } from "@/features/auth/data";
import { deleteImage } from "@/features/storage/server/service";
import { ADMIN_POSTS_PAGE_SIZE } from "./constants";
import { sanitizeContent } from "./sanitize";
import { type Post, posts } from "./schema";
import { isUniqueViolation } from "./slug";
import type {
  CreatePostInput,
  PublishToggleInput,
  UpdatePostInput,
} from "./validation";

export type AdminPostSummary = {
  id: string;
  title: string;
  slug: string;
  coverImageKey: string;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
};

export type ListPostsResult = {
  items: AdminPostSummary[];
  totalItems: number;
  totalPages: number;
  publishedCount: number;
  draftCount: number;
};

/**
 * Admin read query for paginated blog posts list.
 * Ordered by createdAt desc, then id asc for deterministic tie-breaking.
 * Uses a single cheap aggregate query for total and published counts.
 * Uncached request-time data.
 */
export async function listPosts({
  page = 1,
  pageSize = ADMIN_POSTS_PAGE_SIZE,
}: {
  page?: number;
  pageSize?: number;
} = {}): Promise<ListPostsResult> {
  await requireAdmin();

  const [counts] = await db
    .select({
      total: sql<number>`count(*)::int`,
      publishedCount: sql<number>`count(*) filter (where ${posts.published} = true)::int`,
    })
    .from(posts);

  const totalItems = Number(counts?.total ?? 0);
  const publishedCount = Number(counts?.publishedCount ?? 0);
  const draftCount = Math.max(0, totalItems - publishedCount);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const offset = Math.max(0, (page - 1) * pageSize);

  const items = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      coverImageKey: posts.coverImageKey,
      published: posts.published,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .orderBy(desc(posts.createdAt), asc(posts.id))
    .limit(pageSize)
    .offset(offset);

  return {
    items,
    totalItems,
    totalPages,
    publishedCount,
    draftCount,
  };
}

/**
 * Admin read query for a single post by ID.
 * Uncached request-time data.
 */
export async function getPostById(id: string): Promise<Post | null> {
  await requireAdmin();

  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);

  return post ?? null;
}

/**
 * Admin mutation to create a new blog post.
 * - Sanitizes HTML content
 * - Checks slug uniqueness
 * - Sets published = false, publishedAt = null
 */
export async function createPost(input: CreatePostInput): Promise<Post> {
  await requireAdmin();

  // Check slug uniqueness before insert
  const [existingSlug] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.slug, input.slug))
    .limit(1);

  if (existingSlug) {
    throw new Error("A post with this slug already exists.");
  }

  const sanitizedContent = sanitizeContent(input.content);

  try {
    const [created] = await db
      .insert(posts)
      .values({
        title: input.title,
        slug: input.slug,
        content: sanitizedContent,
        coverImageKey: input.coverImageKey,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        published: false,
        publishedAt: null,
      })
      .returning();

    if (!created) {
      throw new Error("Failed to create post.");
    }

    return created;
  } catch (error: unknown) {
    if (isUniqueViolation(error)) {
      throw new Error("A post with this slug already exists.");
    }
    throw error;
  }
}

/**
 * Admin mutation to update an existing blog post.
 * - SLUG LOCK: if the post has ever been published (publishedAt !== null), rejecting any slug change
 * - Deletes replaced cover image from storage AFTER database update succeeds
 */
export async function updatePost(input: UpdatePostInput): Promise<Post> {
  await requireAdmin();

  const [existing] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, input.id))
    .limit(1);

  if (!existing) {
    throw new Error("Post not found.");
  }

  // Slug lock check: once published, slug is immutable
  if (existing.publishedAt !== null && input.slug !== existing.slug) {
    throw new Error("Slug cannot be changed once a post has been published.");
  }

  // If slug changed on a draft, verify new slug uniqueness
  if (input.slug !== existing.slug) {
    const [slugTaken] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, input.slug))
      .limit(1);

    if (slugTaken) {
      throw new Error("A post with this slug already exists.");
    }
  }

  const sanitizedContent = sanitizeContent(input.content);

  let updated: Post | undefined;
  try {
    const [result] = await db
      .update(posts)
      .set({
        title: input.title,
        slug: input.slug,
        content: sanitizedContent,
        coverImageKey: input.coverImageKey,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
      })
      .where(eq(posts.id, input.id))
      .returning();
    updated = result;
  } catch (error: unknown) {
    if (isUniqueViolation(error)) {
      throw new Error("A post with this slug already exists.");
    }
    throw error;
  }

  if (!updated) {
    throw new Error("Failed to update post.");
  }

  // Clean up old cover image if it was replaced
  if (existing.coverImageKey !== input.coverImageKey) {
    try {
      await deleteImage(existing.coverImageKey);
    } catch {
      // Storage deletion failure leaves an orphan image in S3, but database update is committed
    }
  }

  return updated;
}

/**
 * Admin mutation to delete a blog post.
 * - Deletes row first, then deletes cover image from storage
 */
export async function deletePost(id: string): Promise<Post> {
  await requireAdmin();

  const [deleted] = await db.delete(posts).where(eq(posts.id, id)).returning();

  if (!deleted) {
    throw new Error("Post not found.");
  }

  try {
    await deleteImage(deleted.coverImageKey);
  } catch {
    // Storage failure does not fail the delete action because DB row is already removed
  }

  return deleted;
}

/**
 * Admin mutation to toggle publication status.
 * - When setting published = true, set publishedAt = new Date() IF it was null.
 * - Unpublishing does NOT clear publishedAt, preserving the slug lock permanently.
 */
export async function setPostPublished(
  input: PublishToggleInput,
): Promise<Post> {
  await requireAdmin();

  const [existing] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, input.id))
    .limit(1);

  if (!existing) {
    throw new Error("Post not found.");
  }

  let publishedAt = existing.publishedAt;
  if (input.published && publishedAt === null) {
    publishedAt = new Date();
  }

  const [updated] = await db
    .update(posts)
    .set({
      published: input.published,
      publishedAt,
    })
    .where(eq(posts.id, input.id))
    .returning();

  if (!updated) {
    throw new Error("Failed to update post status.");
  }

  return updated;
}
