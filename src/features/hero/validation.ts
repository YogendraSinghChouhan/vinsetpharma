import { z } from "zod";
import {
  HERO_ALLOWED_CONTENT_TYPES,
  HERO_IMAGE_MAX_BYTES,
  HERO_STORAGE_KEY_REGEX,
} from "@/features/storage/constants";
import {
  HERO_ALT_MAX_LENGTH,
  HERO_FOCUS_VALUES,
  HERO_MAX_SLIDES,
  HERO_MIN_ASPECT,
  HERO_MIN_WIDTH,
} from "./constants";

export const heroImageKeySchema = z
  .string()
  .regex(HERO_STORAGE_KEY_REGEX, "Invalid hero storage key format.");

export const heroSlideFocusSchema = z.enum(HERO_FOCUS_VALUES, {
  message: "Invalid focus value. Must be left, center, or right.",
});

export const requestHeroUploadSchema = z.object({
  contentType: z.enum(HERO_ALLOWED_CONTENT_TYPES, {
    message: "Invalid content type. Only JPEG, PNG, and WebP are supported.",
  }),
  size: z
    .number()
    .int("File size must be an integer.")
    .positive("File size must be greater than 0.")
    .max(HERO_IMAGE_MAX_BYTES, "Image size exceeds 10 MB limit."),
});

export type RequestHeroUploadInput = z.infer<typeof requestHeroUploadSchema>;

export const heroSlideItemInputSchema = z
  .object({
    imageKey: heroImageKeySchema,
    width: z
      .number()
      .int("Width must be an integer.")
      .min(HERO_MIN_WIDTH, `Image width must be at least ${HERO_MIN_WIDTH}px.`),
    height: z
      .number()
      .int("Height must be an integer.")
      .positive("Height must be a positive integer."),
    alt: z
      .string()
      .max(
        HERO_ALT_MAX_LENGTH,
        `Alt text cannot exceed ${HERO_ALT_MAX_LENGTH} characters.`,
      )
      .trim()
      .transform((val) => (val === "" ? null : val))
      .nullable()
      .optional()
      .default(null),
    focus: heroSlideFocusSchema.default("center"),
  })
  .superRefine((data, ctx) => {
    const aspect = data.width / data.height;
    if (aspect < HERO_MIN_ASPECT) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Image aspect ratio (${aspect.toFixed(2)}) must be at least ${HERO_MIN_ASPECT} (landscape).`,
        path: ["width"],
      });
    }
  });

export type HeroSlideItemInput = z.infer<typeof heroSlideItemInputSchema>;

export const createHeroSlidesBatchSchema = z
  .array(heroSlideItemInputSchema)
  .min(1, "At least one hero slide must be provided.")
  .max(
    HERO_MAX_SLIDES,
    `Cannot create more than ${HERO_MAX_SLIDES} hero slides in a batch.`,
  );

export type CreateHeroSlidesBatchInput = z.infer<
  typeof createHeroSlidesBatchSchema
>;

export const updateHeroSlideSchema = z.object({
  id: z.string().uuid("Invalid hero slide ID format."),
  alt: z
    .string()
    .max(
      HERO_ALT_MAX_LENGTH,
      `Alt text cannot exceed ${HERO_ALT_MAX_LENGTH} characters.`,
    )
    .trim()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional()
    .default(null),
  focus: heroSlideFocusSchema,
});

export type UpdateHeroSlideInput = z.infer<typeof updateHeroSlideSchema>;

export const reorderHeroSlidesSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid hero slide UUID."))
    .min(1, "Reorder list cannot be empty.")
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Reorder list contains duplicate IDs.",
    }),
});

export type ReorderHeroSlidesInput = z.infer<typeof reorderHeroSlidesSchema>;

export const heroSlideIdSchema = z.string().uuid("Invalid hero slide ID.");
