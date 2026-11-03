import { z } from "zod";

const pageSchema = z.coerce.number().int().positive();

/**
 * Parses and validates an admin pagination ?page= query parameter.
 * Any non-numeric, negative, zero, or malformed input safely resolves to 1.
 */
export function parseAdminPageParam(rawPage: unknown): number {
  const value = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const result = pageSchema.safeParse(value);
  return result.success ? result.data : 1;
}

/**
 * Constructs a pagination link URL.
 * Omit ?page= for page 1 to preserve clean canonical URLs.
 */
export function getAdminPageHref(basePath: string, page: number): string {
  if (page <= 1) {
    return basePath;
  }
  const separator = basePath.includes("?") ? "&" : "?";
  return `${basePath}${separator}page=${page}`;
}

export interface ShowingTextOptions {
  page: number;
  pageSize: number;
  totalItems: number;
}

/**
 * Formats "Showing X to Y of Z" text for admin tables and lists.
 */
export function formatShowingText({
  page,
  pageSize,
  totalItems,
}: ShowingTextOptions): string {
  if (totalItems === 0) {
    return "Showing 0 of 0";
  }
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  return `Showing ${start} to ${end} of ${totalItems}`;
}
