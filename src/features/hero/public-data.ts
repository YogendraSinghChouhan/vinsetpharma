import "server-only";

import { asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db/client";
import { getImageUrl } from "@/features/storage/image-url";
import { HERO_CACHE_TAG, type HeroSlideFocus } from "./constants";
import { heroSlides } from "./schema";

export type PublicHeroSlide = {
  id: string;
  imageKey: string;
  imageUrl: string;
  width: number;
  height: number;
  alt: string | null;
  focus: HeroSlideFocus;
};

function isTableMissingError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as Record<string, unknown>;
  if (e.code === "42P01") return true;
  if (
    e.cause &&
    typeof e.cause === "object" &&
    (e.cause as Record<string, unknown>).code === "42P01"
  ) {
    return true;
  }
  if (
    typeof e.message === "string" &&
    e.message.includes('relation "hero_slides" does not exist')
  ) {
    return true;
  }
  return false;
}

/**
 * Public read query for dynamic home hero slides.
 * Returns all slides ordered by sortOrder ASC, createdAt ASC, id ASC.
 * Uses 'use cache' with HERO_CACHE_TAG and 'days' cacheLife.
 * Database errors propagate without suppression; missing table error (42P01)
 * falls back to an empty list so unmigrated environments render the fallback hero.
 */
export async function getHeroSlides(): Promise<PublicHeroSlide[]> {
  "use cache";
  cacheTag(HERO_CACHE_TAG);
  cacheLife("days");

  try {
    const rows = await db
      .select({
        id: heroSlides.id,
        imageKey: heroSlides.imageKey,
        width: heroSlides.width,
        height: heroSlides.height,
        alt: heroSlides.alt,
        focus: heroSlides.focus,
      })
      .from(heroSlides)
      .orderBy(
        asc(heroSlides.sortOrder),
        asc(heroSlides.createdAt),
        asc(heroSlides.id),
      );

    return rows.map((row) => ({
      ...row,
      imageUrl: getImageUrl(row.imageKey),
    }));
  } catch (error) {
    if (isTableMissingError(error)) {
      return [];
    }
    throw error;
  }
}
