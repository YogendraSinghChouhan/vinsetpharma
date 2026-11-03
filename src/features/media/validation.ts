import { z } from "zod";
import {
  isValidMediaKey,
  isValidMediaPosterKey,
  MEDIA_ALLOWED_CONTENT_TYPES,
  MEDIA_IMAGE_MAX_BYTES,
  MEDIA_VIDEO_CONTENT_TYPES,
  MEDIA_VIDEO_MAX_BYTES,
} from "@/features/storage/constants";
import {
  MEDIA_CAPTION_MAX_LENGTH,
  MEDIA_MAX_BATCH_SIZE,
  MEDIA_MAX_ITEMS,
} from "./constants";

export const mediaTypeSchema = z.enum(["image", "video"]);

export const mediaKeySchema = z
  .string()
  .trim()
  .refine(isValidMediaKey, "File key must be a valid media storage key.");

export const mediaPosterKeySchema = z
  .string()
  .trim()
  .refine(
    isValidMediaPosterKey,
    "Poster key must be a valid media image storage key.",
  );

export const mediaWidthSchema = z
  .number()
  .int("Width must be an integer.")
  .positive("Width must be a positive integer.")
  .max(10000, "Width cannot exceed 10000 pixels.");

export const mediaHeightSchema = z
  .number()
  .int("Height must be an integer.")
  .positive("Height must be a positive integer.")
  .max(10000, "Height cannot exceed 10000 pixels.");

export const mediaDurationSchema = z
  .number()
  .int("Duration must be an integer.")
  .positive("Duration must be a positive integer.")
  .max(86400, "Duration cannot exceed 24 hours.")
  .nullable()
  .optional();

export const mediaCaptionSchema = z
  .string()
  .trim()
  .max(
    MEDIA_CAPTION_MAX_LENGTH,
    `Caption cannot exceed ${MEDIA_CAPTION_MAX_LENGTH} characters.`,
  )
  .transform((val) => (val.length === 0 ? null : val))
  .nullable()
  .optional();

export const mediaItemInputSchema = z
  .object({
    type: mediaTypeSchema,
    fileKey: mediaKeySchema,
    posterKey: mediaPosterKeySchema.nullable().optional(),
    width: mediaWidthSchema,
    height: mediaHeightSchema,
    durationSeconds: mediaDurationSchema,
    caption: mediaCaptionSchema,
  })
  .superRefine((data, ctx) => {
    const fileExt = data.fileKey.split(".").pop()?.toLowerCase();
    const isFileImage = ["jpg", "png", "webp"].includes(fileExt ?? "");
    const isFileVideo = ["mp4", "webm"].includes(fileExt ?? "");

    if (data.type === "video") {
      if (!isFileVideo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Video fileKey must have a .mp4 or .webm extension.",
          path: ["fileKey"],
        });
      }

      if (!data.posterKey) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Videos require a posterKey.",
          path: ["posterKey"],
        });
      }

      if (
        typeof data.durationSeconds !== "number" ||
        data.durationSeconds <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Videos require a positive duration in seconds.",
          path: ["durationSeconds"],
        });
      }
    } else if (data.type === "image") {
      if (!isFileImage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Image fileKey must have a .jpg, .png, or .webp extension.",
          path: ["fileKey"],
        });
      }

      if (data.posterKey !== null && data.posterKey !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Photos must not have a posterKey.",
          path: ["posterKey"],
        });
      }

      if (data.durationSeconds !== null && data.durationSeconds !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Photos must not have a duration.",
          path: ["durationSeconds"],
        });
      }
    }
  });

export type MediaItemInput = z.infer<typeof mediaItemInputSchema>;

export const createMediaBatchSchema = z
  .array(mediaItemInputSchema)
  .min(1, "At least one media item is required.")
  .max(
    MEDIA_MAX_BATCH_SIZE,
    `Cannot upload more than ${MEDIA_MAX_BATCH_SIZE} media items at once.`,
  );

export type CreateMediaBatchInput = z.infer<typeof createMediaBatchSchema>;

export const updateMediaCaptionSchema = z.object({
  id: z.string().uuid("Invalid media ID format."),
  caption: mediaCaptionSchema,
});

export type UpdateMediaCaptionInput = z.infer<typeof updateMediaCaptionSchema>;

export const reorderMediaSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid media ID format."))
    .min(1, "IDs array cannot be empty.")
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "IDs array must not contain duplicate items.",
    ),
});

export type ReorderMediaInput = z.infer<typeof reorderMediaSchema>;

export const mediaIdSchema = z.string().uuid("Invalid media ID format.");

export const bulkDeleteMediaSchema = z
  .array(z.string().uuid("Invalid media ID format."))
  .min(1, "At least one media item must be selected.")
  .max(
    MEDIA_MAX_ITEMS,
    `Cannot delete more than ${MEDIA_MAX_ITEMS} media items at once.`,
  )
  .refine(
    (ids) => new Set(ids).size === ids.length,
    "IDs array must not contain duplicate items.",
  );

export type BulkDeleteMediaInput = z.infer<typeof bulkDeleteMediaSchema>;

export const requestMediaUploadSchema = z
  .object({
    contentType: z.enum(MEDIA_ALLOWED_CONTENT_TYPES, {
      message: "Unsupported media content type.",
    }),
    size: z
      .number()
      .int("Size must be an integer.")
      .positive("File size must be greater than 0."),
  })
  .superRefine((data, ctx) => {
    const isVideo = MEDIA_VIDEO_CONTENT_TYPES.includes(
      data.contentType as (typeof MEDIA_VIDEO_CONTENT_TYPES)[number],
    );
    const maxBytes = isVideo ? MEDIA_VIDEO_MAX_BYTES : MEDIA_IMAGE_MAX_BYTES;

    if (data.size > maxBytes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: isVideo
          ? "Video size exceeds 100 MB limit."
          : "Image size exceeds 10 MB limit.",
        path: ["size"],
      });
    }
  });

export type RequestMediaUploadInput = z.infer<typeof requestMediaUploadSchema>;
