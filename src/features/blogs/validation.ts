import { z } from "zod";
import { isValidStorageKey } from "@/features/storage/constants";
import { POST_LIMITS } from "./constants";

export const postIdSchema = z.string().uuid("Invalid post ID format.");

export const postTitleSchema = z
  .string()
  .trim()
  .min(
    POST_LIMITS.title.min,
    `Title must be at least ${POST_LIMITS.title.min} characters.`,
  )
  .max(
    POST_LIMITS.title.max,
    `Title cannot exceed ${POST_LIMITS.title.max} characters.`,
  );

export const postSlugSchema = z
  .string()
  .trim()
  .min(
    POST_LIMITS.slug.min,
    `Slug must be at least ${POST_LIMITS.slug.min} characters.`,
  )
  .max(
    POST_LIMITS.slug.max,
    `Slug cannot exceed ${POST_LIMITS.slug.max} characters.`,
  )
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, digits, and single hyphens (no leading, trailing, or consecutive hyphens).",
  );

export const postContentSchema = z
  .string()
  .min(1, "Content is required.")
  .max(
    POST_LIMITS.content.max,
    `Content cannot exceed ${POST_LIMITS.content.max.toLocaleString()} characters.`,
  )
  .refine(
    (html) => {
      // Strip tags and &nbsp; entities to verify visible text exists
      const stripped = html
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .trim();
      return stripped.length > 0;
    },
    {
      message:
        "Content must contain visible text (empty paragraphs are not allowed).",
    },
  );

export const postCoverImageKeySchema = z
  .string()
  .trim()
  .refine((key) => isValidStorageKey(key) && key.startsWith("blogs/"), {
    message: 'Cover image must be an uploaded file in the "blogs" folder.',
  });

export const postSeoTitleSchema = z
  .string()
  .trim()
  .max(
    POST_LIMITS.seoTitle.max,
    `SEO title cannot exceed ${POST_LIMITS.seoTitle.max} characters.`,
  )
  .optional()
  .nullable()
  .transform((val) => (val && val.length > 0 ? val : null));

export const postSeoDescriptionSchema = z
  .string()
  .trim()
  .max(
    POST_LIMITS.seoDescription.max,
    `SEO description cannot exceed ${POST_LIMITS.seoDescription.max} characters.`,
  )
  .optional()
  .nullable()
  .transform((val) => (val && val.length > 0 ? val : null));

export const createPostSchema = z.object({
  title: postTitleSchema,
  slug: postSlugSchema,
  content: postContentSchema,
  coverImageKey: postCoverImageKeySchema,
  seoTitle: postSeoTitleSchema,
  seoDescription: postSeoDescriptionSchema,
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  id: postIdSchema,
  title: postTitleSchema,
  slug: postSlugSchema,
  content: postContentSchema,
  coverImageKey: postCoverImageKeySchema,
  seoTitle: postSeoTitleSchema,
  seoDescription: postSeoDescriptionSchema,
});

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export const publishToggleSchema = z.object({
  id: postIdSchema,
  published: z.boolean(),
});

export type PublishToggleInput = z.infer<typeof publishToggleSchema>;
