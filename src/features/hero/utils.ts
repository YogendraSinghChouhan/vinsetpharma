import {
  HERO_ALLOWED_CONTENT_TYPES,
  HERO_IMAGE_MAX_BYTES,
} from "@/features/storage/constants";
import type { HeroSlideFocus } from "./constants";

/**
 * Formats bytes into a human-readable string (KB, MB).
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

/**
 * Returns CSS object-position coordinate string from focus enum.
 */
export function getFocusPosition(focus: HeroSlideFocus): string {
  switch (focus) {
    case "left":
      return "left center";
    case "right":
      return "right center";
    default:
      return "center center";
  }
}

/**
 * Validates a candidate File before dimension analysis.
 */
export function validateHeroFileTypeAndSize(file: File): {
  valid: boolean;
  error?: string;
} {
  const isAllowedType = (
    HERO_ALLOWED_CONTENT_TYPES as readonly string[]
  ).includes(file.type);
  if (!isAllowedType) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || "unknown"}). Only JPG, PNG, and WebP are allowed.`,
    };
  }

  if (file.size > HERO_IMAGE_MAX_BYTES) {
    return {
      valid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds the maximum limit of 10 MB.`,
    };
  }

  return { valid: true };
}
