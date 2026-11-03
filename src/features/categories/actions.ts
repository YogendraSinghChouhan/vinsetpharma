"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/features/auth/data";
import { PRODUCT_CACHE_TAGS } from "@/features/products/constants";
import { CATEGORY_CACHE_TAGS } from "./constants";
import * as categoryData from "./data";
import type { Category } from "./schema";
import {
  categoryIdSchema,
  createCategorySchema,
  reorderCategoriesSchema,
  updateCategorySchema,
} from "./validation";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createCategory(
  input: unknown,
): Promise<ActionResult<Category>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required.",
    };
  }

  const parsed = createCategorySchema.safeParse(input);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid category parameters.";
    return {
      success: false,
      error: message,
    };
  }

  try {
    const created = await categoryData.createCategory(parsed.data);
    updateTag(CATEGORY_CACHE_TAGS.list);
    updateTag(PRODUCT_CACHE_TAGS.list);
    return {
      success: true,
      data: created,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create category.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function updateCategory(
  input: unknown,
): Promise<ActionResult<Category>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required.",
    };
  }

  const parsed = updateCategorySchema.safeParse(input);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid category update parameters.";
    return {
      success: false,
      error: message,
    };
  }

  try {
    const updated = await categoryData.updateCategory(parsed.data);
    updateTag(CATEGORY_CACHE_TAGS.list);
    updateTag(CATEGORY_CACHE_TAGS.bySlug(updated.slug));
    updateTag(PRODUCT_CACHE_TAGS.list);
    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update category.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function deleteCategory(
  idInput: unknown,
): Promise<ActionResult<Category>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required.",
    };
  }

  const parsed = categoryIdSchema.safeParse(idInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid category ID format.",
    };
  }

  try {
    const deleted = await categoryData.deleteCategory(parsed.data);
    updateTag(CATEGORY_CACHE_TAGS.list);
    updateTag(CATEGORY_CACHE_TAGS.bySlug(deleted.slug));
    updateTag(PRODUCT_CACHE_TAGS.list);
    return {
      success: true,
      data: deleted,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete category.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function reorderCategories(
  input: unknown,
): Promise<ActionResult<void>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required.",
    };
  }

  const parsed = reorderCategoriesSchema.safeParse(input);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid category reorder parameters.";
    return {
      success: false,
      error: message,
    };
  }

  try {
    await categoryData.reorderCategories(parsed.data);
    updateTag(CATEGORY_CACHE_TAGS.list);
    updateTag(PRODUCT_CACHE_TAGS.list);
    return {
      success: true,
      data: undefined,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to reorder categories.";
    return {
      success: false,
      error: message,
    };
  }
}
