import { z } from "zod";
import {
  ALLOWED_CONTENT_TYPES,
  ALLOWED_UPLOAD_PURPOSES,
  MAX_IMAGE_SIZE_BYTES,
  STORAGE_KEY_REGEX,
} from "./constants";

export const uploadRequestSchema = z.object({
  purpose: z.enum(ALLOWED_UPLOAD_PURPOSES),
  contentType: z.enum(ALLOWED_CONTENT_TYPES),
  size: z
    .number()
    .int()
    .positive("File size must be greater than 0.")
    .max(MAX_IMAGE_SIZE_BYTES, "Image size exceeds 5 MB limit."),
});

export type UploadRequestInput = z.infer<typeof uploadRequestSchema>;

export const storageKeySchema = z
  .string()
  .regex(STORAGE_KEY_REGEX, "Invalid storage key format.");

export type StorageKey = z.infer<typeof storageKeySchema>;
