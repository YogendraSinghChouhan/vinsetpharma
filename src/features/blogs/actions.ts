"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/features/auth/data";
import { GENERIC_ACTION_ERROR, logActionError } from "@/lib/server-error";
import { BLOG_CACHE_TAGS } from "./constants";
import * as blogData from "./data";
import type { Post } from "./schema";
import {
  createPostSchema,
  postIdSchema,
  publishToggleSchema,
  updatePostSchema,
} from "./validation";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createPost(input: unknown): Promise<ActionResult<Post>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required.",
    };
  }

  const parsed = createPostSchema.safeParse(input);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid post parameters.";
    return {
      success: false,
      error: message,
    };
  }

  try {
    const created = await blogData.createPost(parsed.data);
    updateTag(BLOG_CACHE_TAGS.list);
    updateTag(BLOG_CACHE_TAGS.bySlug(created.slug));
    return {
      success: true,
      data: created,
    };
  } catch (error: unknown) {
    logActionError("blogs.create", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}

export async function updatePost(input: unknown): Promise<ActionResult<Post>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required.",
    };
  }

  const parsed = updatePostSchema.safeParse(input);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid post update parameters.";
    return {
      success: false,
      error: message,
    };
  }

  try {
    const updated = await blogData.updatePost(parsed.data);
    updateTag(BLOG_CACHE_TAGS.list);
    updateTag(BLOG_CACHE_TAGS.bySlug(updated.slug));
    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    logActionError("blogs.update", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}

export async function deletePost(
  idInput: unknown,
): Promise<ActionResult<Post>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required.",
    };
  }

  const parsed = postIdSchema.safeParse(idInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid post ID format.",
    };
  }

  try {
    const deleted = await blogData.deletePost(parsed.data);
    updateTag(BLOG_CACHE_TAGS.list);
    updateTag(BLOG_CACHE_TAGS.bySlug(deleted.slug));
    return {
      success: true,
      data: deleted,
    };
  } catch (error: unknown) {
    logActionError("blogs.delete", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}

export async function setPostPublished(
  input: unknown,
): Promise<ActionResult<Post>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required.",
    };
  }

  const parsed = publishToggleSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid publish toggle parameters.",
    };
  }

  try {
    const updated = await blogData.setPostPublished(parsed.data);
    updateTag(BLOG_CACHE_TAGS.list);
    updateTag(BLOG_CACHE_TAGS.bySlug(updated.slug));
    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    logActionError("blogs.setPublished", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}
