import {
  isUniqueViolation,
  MAX_SLUG_RETRY_ATTEMPTS,
  SLUG_MAX_LENGTH,
  slugify as sharedSlugify,
} from "@/lib/slug";

export { isUniqueViolation, MAX_SLUG_RETRY_ATTEMPTS, SLUG_MAX_LENGTH };

/**
 * Generates a URL-friendly slug for a product, defaulting fallback to "product".
 */
export function slugify(title: string): string {
  return sharedSlugify(title, "product");
}
