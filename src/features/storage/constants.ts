export const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const PRESIGNED_URL_EXPIRY_SECONDS = 60; // 60 seconds

export const ALLOWED_UPLOAD_PURPOSES = [
  "products",
  "blogs",
  "categories",
  "media",
] as const;

export type UploadPurpose = (typeof ALLOWED_UPLOAD_PURPOSES)[number];

export const MEDIA_IMAGE_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type MediaImageContentType = (typeof MEDIA_IMAGE_CONTENT_TYPES)[number];

export const MEDIA_VIDEO_CONTENT_TYPES = ["video/mp4", "video/webm"] as const;

export type MediaVideoContentType = (typeof MEDIA_VIDEO_CONTENT_TYPES)[number];

export const MEDIA_ALLOWED_CONTENT_TYPES = [
  ...MEDIA_IMAGE_CONTENT_TYPES,
  ...MEDIA_VIDEO_CONTENT_TYPES,
] as const;

export type MediaAllowedContentType =
  (typeof MEDIA_ALLOWED_CONTENT_TYPES)[number];

export const MEDIA_IMAGE_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
export const MEDIA_VIDEO_MAX_BYTES = 100 * 1024 * 1024; // 100 MB
export const MEDIA_MAX_ITEMS = 100;

/**
 * 15 minutes (900 seconds) presigned upload window for media files.
 * Chosen because 100 MB video uploads may experience client queueing,
 * browser-side video poster frame extraction, and slower mobile network bandwidth
 * before the HTTP PUT initiates with S3.
 */
export const MEDIA_PRESIGNED_EXPIRY_SECONDS = 900;

export const CONTENT_TYPE_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

/**
 * Expected pattern for S3 object keys:
 * - products|blogs|categories: UUID with .jpg, .png, or .webp
 * - media: UUID with .jpg, .png, .webp, .mp4, or .webm
 */
export const STORAGE_KEY_REGEX =
  /^(?:(products|blogs|categories)\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)|media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|mp4|webm))$/i;

export const MEDIA_STORAGE_KEY_REGEX =
  /^media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|mp4|webm)$/i;

export const MEDIA_POSTER_KEY_REGEX =
  /^media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i;

export function isValidStorageKey(key: string): boolean {
  return STORAGE_KEY_REGEX.test(key);
}

export function isValidMediaKey(key: string): boolean {
  return MEDIA_STORAGE_KEY_REGEX.test(key);
}

export function isValidMediaPosterKey(key: string): boolean {
  return MEDIA_POSTER_KEY_REGEX.test(key);
}
