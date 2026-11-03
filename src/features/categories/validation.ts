import { z } from "zod";
import { isValidStorageKey } from "@/features/storage/constants";
import { CATEGORY_LIMITS } from "./constants";

export const categoryIdSchema = z.string().uuid("Invalid category ID format.");

export const categoryNameSchema = z
  .string()
  .trim()
  .min(
    CATEGORY_LIMITS.name.min,
    `Name must be at least ${CATEGORY_LIMITS.name.min} characters.`,
  )
  .max(
    CATEGORY_LIMITS.name.max,
    `Name cannot exceed ${CATEGORY_LIMITS.name.max} characters.`,
  );

export const categoryImageKeySchema = z
  .string()
  .trim()
  .refine(
    (key) => isValidStorageKey(key) && key.startsWith("categories/"),
    "Image must be an uploaded file in the categories folder.",
  );

export const createCategorySchema = z.object({
  name: categoryNameSchema,
  imageKey: categoryImageKeySchema
    .nullable()
    .optional()
    .transform((val) => (val ? val : null)),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  id: categoryIdSchema,
  name: categoryNameSchema,
  imageKey: categoryImageKeySchema
    .nullable()
    .optional()
    .transform((val) => (val ? val : null)),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const reorderCategoriesSchema = z.object({
  ids: z
    .array(categoryIdSchema)
    .min(1, "At least one category ID must be provided.")
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "Category IDs must all be unique.",
    ),
});

export type ReorderCategoriesInput = z.infer<typeof reorderCategoriesSchema>;
