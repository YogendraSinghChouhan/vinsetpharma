export const SLUG_MAX_LENGTH = 80;
export const MAX_SLUG_RETRY_ATTEMPTS = 10;

/**
 * Pure function to generate a URL-friendly slug from a title:
 * - lowercase
 * - ASCII characters only
 * - hyphenated words without duplicate hyphens
 * - length-capped
 * - fallback to "item" when input is empty or contains no ASCII alphanumerics
 */
export function slugify(title: string, fallback = "item"): string {
  const normalized = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/, "");

  return normalized || fallback;
}

/**
 * Detects PostgreSQL unique-constraint violation (code 23505).
 * Walks the error.cause chain to inspect wrapped driver errors (e.g. DrizzleQueryError).
 */
export function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error;
  const visited = new Set<unknown>();

  while (current && typeof current === "object" && !visited.has(current)) {
    visited.add(current);

    if ("code" in current && (current as { code?: unknown }).code === "23505") {
      return true;
    }
    if (
      "message" in current &&
      typeof (current as { message?: unknown }).message === "string" &&
      ((current as { message: string }).message.includes("23505") ||
        (current as { message: string }).message.includes("unique constraint"))
    ) {
      return true;
    }

    if ("cause" in current) {
      current = (current as { cause?: unknown }).cause;
    } else {
      break;
    }
  }

  return false;
}
