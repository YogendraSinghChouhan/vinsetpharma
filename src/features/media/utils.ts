import {
  MEDIA_IMAGE_CONTENT_TYPES,
  MEDIA_IMAGE_MAX_BYTES,
  MEDIA_VIDEO_CONTENT_TYPES,
  MEDIA_VIDEO_MAX_BYTES,
} from "@/features/storage/constants";

/**
 * Formats a duration in integer seconds into a human-readable mm:ss or hh:mm:ss string.
 */
export function formatDuration(seconds: number | null | undefined): string {
  if (typeof seconds !== "number" || seconds < 0 || !Number.isFinite(seconds)) {
    return "0:00";
  }

  const rounded = Math.round(seconds);
  const hrs = Math.floor(rounded / 3600);
  const mins = Math.floor((rounded % 3600) / 60);
  const secs = rounded % 60;

  const paddedSecs = secs.toString().padStart(2, "0");

  if (hrs > 0) {
    const paddedMins = mins.toString().padStart(2, "0");
    return `${hrs}:${paddedMins}:${paddedSecs}`;
  }

  return `${mins}:${paddedSecs}`;
}

/**
 * Formats bytes into a human-readable string (KB, MB, GB).
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const size = bytes / 1024 ** i;

  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export type FileValidationResult =
  | { valid: true; type: "image" | "video" }
  | { valid: false; error: string };

/**
 * Validates a client-side File before starting an upload.
 */
export function validateMediaFile(file: File): FileValidationResult {
  const isImage = (MEDIA_IMAGE_CONTENT_TYPES as readonly string[]).includes(
    file.type,
  );
  const isVideo = (MEDIA_VIDEO_CONTENT_TYPES as readonly string[]).includes(
    file.type,
  );

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: `Unsupported file type "${file.type || "unknown"}". Allowed: JPEG, PNG, WebP, MP4, WebM.`,
    };
  }

  if (isImage && file.size > MEDIA_IMAGE_MAX_BYTES) {
    return {
      valid: false,
      error: `Photo exceeds the 10 MB limit (${formatFileSize(file.size)}).`,
    };
  }

  if (isVideo && file.size > MEDIA_VIDEO_MAX_BYTES) {
    return {
      valid: false,
      error: `Video exceeds the 100 MB limit (${formatFileSize(file.size)}).`,
    };
  }

  return {
    valid: true,
    type: isVideo ? "video" : "image",
  };
}
