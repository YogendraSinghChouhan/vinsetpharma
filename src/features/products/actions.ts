"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/features/auth/data";
import { CATEGORY_CACHE_TAGS } from "@/features/categories/constants";
import { PRODUCT_CACHE_TAGS } from "./constants";
import * as productData from "./data";
import type { Product } from "./schema";
import {
  createProductSchema,
  productIdSchema,
  publishToggleSchema,
  reorderProductsSchema,
  setProductFeaturedSchema,
  updateProductSchema,
} from "./validation";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createProduct(
  input: unknown,
): Promise<ActionResult<Product>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required.",
    };
  }

  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid product parameters.";
    return {
      success: false,
      error: message,
    };
  }

  try {
    const created = await productData.createProduct(parsed.data);
    updateTag(PRODUCT_CACHE_TAGS.list);
    updateTag(CATEGORY_CACHE_TAGS.list);
    return {
      success: true,
      data: created,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create product.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function updateProduct(
  input: unknown,
): Promise<ActionResult<Product>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required.",
    };
  }

  const parsed = updateProductSchema.safeParse(input);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid product update parameters.";
    return {
      success: false,
      error: message,
    };
  }

  try {
    const updated = await productData.updateProduct(parsed.data);
    updateTag(PRODUCT_CACHE_TAGS.list);
    updateTag(PRODUCT_CACHE_TAGS.bySlug(updated.slug));
    updateTag(CATEGORY_CACHE_TAGS.list);
    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update product.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function deleteProduct(
  idInput: unknown,
): Promise<ActionResult<Product>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required.",
    };
  }

  const parsed = productIdSchema.safeParse(idInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid product ID format.",
    };
  }

  try {
    const deleted = await productData.deleteProduct(parsed.data);
    updateTag(PRODUCT_CACHE_TAGS.list);
    updateTag(PRODUCT_CACHE_TAGS.bySlug(deleted.slug));
    updateTag(CATEGORY_CACHE_TAGS.list);
    return {
      success: true,
      data: deleted,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete product.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function setProductPublished(
  input: unknown,
): Promise<ActionResult<Product>> {
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
    const updated = await productData.setProductPublished(parsed.data);
    updateTag(PRODUCT_CACHE_TAGS.list);
    updateTag(PRODUCT_CACHE_TAGS.bySlug(updated.slug));
    updateTag(CATEGORY_CACHE_TAGS.list);
    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update publication status.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function setProductFeaturedAction(
  input: unknown,
): Promise<ActionResult<Product>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required.",
    };
  }

  const parsed = setProductFeaturedSchema.safeParse(input);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid featured parameters.";
    return {
      success: false,
      error: message,
    };
  }

  try {
    const updated = await productData.setProductFeatured(parsed.data);
    updateTag(PRODUCT_CACHE_TAGS.list);
    updateTag(PRODUCT_CACHE_TAGS.bySlug(updated.slug));
    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update featured status.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function reorderProducts(
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

  const parsed = reorderProductsSchema.safeParse(input);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid product reorder parameters.";
    return {
      success: false,
      error: message,
    };
  }

  try {
    await productData.reorderProducts(parsed.data);
    updateTag(PRODUCT_CACHE_TAGS.list);
    updateTag(CATEGORY_CACHE_TAGS.list);
    return {
      success: true,
      data: undefined,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to reorder products.";
    return {
      success: false,
      error: message,
    };
  }
}
