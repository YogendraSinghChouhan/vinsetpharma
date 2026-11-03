import { z } from "zod";
import { isValidStorageKey } from "@/features/storage/constants";
import { PRODUCT_LIMITS } from "./constants";

export const productIdSchema = z.string().uuid("Invalid product ID format.");

export const productCategoryIdSchema = z
  .string()
  .uuid("Please select a category.");

export const productTitleSchema = z
  .string()
  .trim()
  .min(
    PRODUCT_LIMITS.title.min,
    `Title must be at least ${PRODUCT_LIMITS.title.min} characters.`,
  )
  .max(
    PRODUCT_LIMITS.title.max,
    `Title cannot exceed ${PRODUCT_LIMITS.title.max} characters.`,
  );

export const productTaglineSchema = z
  .string()
  .trim()
  .max(
    PRODUCT_LIMITS.tagline.max,
    `Tagline cannot exceed ${PRODUCT_LIMITS.tagline.max} characters.`,
  );

export const productDescriptionSchema = z
  .string()
  .trim()
  .min(1, "Description is required.")
  .max(
    PRODUCT_LIMITS.description.max,
    `Description cannot exceed ${PRODUCT_LIMITS.description.max} characters.`,
  );

export const productImageKeySchema = z
  .string()
  .trim()
  .refine(
    (key) => isValidStorageKey(key) && key.startsWith("products/"),
    "Image must be an uploaded file in the products folder.",
  );

export const createProductSchema = z.object({
  title: productTitleSchema,
  tagline: productTaglineSchema,
  description: productDescriptionSchema,
  imageKey: productImageKeySchema,
  categoryId: productCategoryIdSchema,
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  id: productIdSchema,
  title: productTitleSchema,
  tagline: productTaglineSchema,
  description: productDescriptionSchema,
  imageKey: productImageKeySchema,
  categoryId: productCategoryIdSchema,
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const publishToggleSchema = z.object({
  id: productIdSchema,
  published: z.boolean(),
});

export type PublishToggleInput = z.infer<typeof publishToggleSchema>;

export const setProductFeaturedSchema = z.object({
  id: productIdSchema,
  featured: z.boolean(),
});

export type SetProductFeaturedInput = z.infer<typeof setProductFeaturedSchema>;

export const reorderProductsSchema = z.object({
  ids: z
    .array(productIdSchema)
    .min(2, "At least two product IDs are required to reorder.")
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "Product IDs must all be unique.",
    ),
});

export type ReorderProductsInput = z.infer<typeof reorderProductsSchema>;
