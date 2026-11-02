export const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const PRESIGNED_URL_EXPIRY_SECONDS = 60; // 60 seconds

export const ALLOWED_UPLOAD_PURPOSES = ["products", "blogs"] as const;

export type UploadPurpose = (typeof ALLOWED_UPLOAD_PURPOSES)[number];

export const CONTENT_TYPE_TO_EXTENSION: Record<AllowedContentType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Expected pattern for S3 object keys: `${purpose}/${uuid}.${ext}`
 */
export const STORAGE_KEY_REGEX =
  /^(products|blogs)\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i;

export function isValidStorageKey(key: string): boolean {
  return STORAGE_KEY_REGEX.test(key);
}
