import { createHash } from "node:crypto";

export const SAMPLE_HERO_LIMIT = 4;

/**
 * Derives a deterministic UUID and storage key for a sample hero slide.
 * Uses sha1("vinset-sample-hero-<index>") formatted as 8-4-4-4-12 hex.
 * Valid under the hero key regex `^hero\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$`.
 */
export function getSampleHeroStorageKey(index: number, ext = "jpg"): string {
  const hash = createHash("sha1")
    .update(`vinset-sample-hero-${index}`)
    .digest("hex");
  const uuid = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
  return `hero/${uuid}.${ext}`;
}

/**
 * Pre-computed deterministic keys for all 4 potential sample hero slides.
 */
export const ALL_SAMPLE_HERO_KEYS = Array.from(
  { length: SAMPLE_HERO_LIMIT },
  (_, i) => getSampleHeroStorageKey(i + 1, "jpg"),
);
