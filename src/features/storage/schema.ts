import { z } from "zod";
import {
  ALLOWED_CONTENT_TYPES,
  ALLOWED_UPLOAD_PURPOSES,
  HERO_ALLOWED_CONTENT_TYPES,
  HERO_IMAGE_MAX_BYTES,
  MAX_IMAGE_SIZE_BYTES,
  MEDIA_ALLOWED_CONTENT_TYPES,
  MEDIA_IMAGE_MAX_BYTES,
  MEDIA_VIDEO_CONTENT_TYPES,
  MEDIA_VIDEO_MAX_BYTES,
  STORAGE_KEY_REGEX,
} from "./constants";

export const uploadRequestSchema = z
  .object({
    purpose: z.enum(ALLOWED_UPLOAD_PURPOSES),
    contentType: z.string(),
    size: z.number().int().positive("File size must be greater than 0."),
  })
  .superRefine((data, ctx) => {
    if (data.purpose === "hero") {
      if (
        !HERO_ALLOWED_CONTENT_TYPES.includes(
          data.contentType as (typeof HERO_ALLOWED_CONTENT_TYPES)[number],
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid content type for hero upload.",
          path: ["contentType"],
        });
        return;
      }

      if (data.size > HERO_IMAGE_MAX_BYTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Image size exceeds 10 MB limit.",
          path: ["size"],
        });
      }
    } else if (data.purpose === "media") {
      if (
        !MEDIA_ALLOWED_CONTENT_TYPES.includes(
          data.contentType as (typeof MEDIA_ALLOWED_CONTENT_TYPES)[number],
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid content type for media upload.",
          path: ["contentType"],
        });
        return;
      }

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
    } else {
      if (
        !ALLOWED_CONTENT_TYPES.includes(
          data.contentType as (typeof ALLOWED_CONTENT_TYPES)[number],
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid content type for image upload.",
          path: ["contentType"],
        });
        return;
      }

      if (data.size > MAX_IMAGE_SIZE_BYTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Image size exceeds 5 MB limit.",
          path: ["size"],
        });
      }
    }
  });

export type UploadRequestInput = z.infer<typeof uploadRequestSchema>;

export const storageKeySchema = z
  .string()
  .regex(STORAGE_KEY_REGEX, "Invalid storage key format.");

export type StorageKey = z.infer<typeof storageKeySchema>;
