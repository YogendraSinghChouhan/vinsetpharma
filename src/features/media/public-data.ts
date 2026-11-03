import "server-only";

import { asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db/client";
import { MEDIA_CACHE_TAG, MEDIA_CAROUSEL_LIMIT } from "./constants";
import { type MediaType, media } from "./schema";

export type PublicMediaItem = {
  id: string;
  type: MediaType;
  fileKey: string;
  posterKey: string | null;
  width: number;
  height: number;
  durationSeconds: number | null;
  caption: string | null;
};

/**
 * Public read query for showcase media items.
 * Ordered by sortOrder ASC, createdAt ASC, id ASC (matching admin curation order).
 * Uses 'use cache' with MEDIA_CACHE_TAG and 'days' cacheLife.
 */
export async function getTopMedia(
  limit: number = MEDIA_CAROUSEL_LIMIT,
): Promise<PublicMediaItem[]> {
  "use cache";
  cacheTag(MEDIA_CACHE_TAG);
  cacheLife("days");

  const rows = await db
    .select({
      id: media.id,
      type: media.type,
      fileKey: media.fileKey,
      posterKey: media.posterKey,
      width: media.width,
      height: media.height,
      durationSeconds: media.durationSeconds,
      caption: media.caption,
    })
    .from(media)
    .orderBy(asc(media.sortOrder), asc(media.createdAt), asc(media.id))
    .limit(limit);

  return rows;
}
