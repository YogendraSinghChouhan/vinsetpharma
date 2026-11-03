import {
  isUniqueViolation,
  MAX_SLUG_RETRY_ATTEMPTS,
  SLUG_MAX_LENGTH,
  slugify as sharedSlugify,
} from "@/lib/slug";

export { isUniqueViolation, MAX_SLUG_RETRY_ATTEMPTS, SLUG_MAX_LENGTH };

/**
 * Generates a URL-friendly slug for a category, defaulting fallback to "category".
 */
export function slugify(name: string): string {
  return sharedSlugify(name, "category");
}
