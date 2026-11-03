import "server-only";

import { asc, count, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { buildReorderStatement } from "@/db/reorder";
import { requireAdmin } from "@/features/auth/data";
import {
  MEDIA_IMAGE_CONTENT_TYPES,
  MEDIA_IMAGE_MAX_BYTES,
  MEDIA_VIDEO_CONTENT_TYPES,
  MEDIA_VIDEO_MAX_BYTES,
} from "@/features/storage/constants";
import { deleteObject, headObject } from "@/features/storage/server/service";
import { MEDIA_MAX_ITEMS } from "./constants";
import { type Media, media } from "./schema";
import type {
  MediaItemInput,
  ReorderMediaInput,
  UpdateMediaCaptionInput,
} from "./validation";

export class MediaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaValidationError";
  }
}

/**
 * Returns all media items ordered by sortOrder ascending, then createdAt, then id.
 */
export async function listMedia(): Promise<Media[]> {
  await requireAdmin();

  return db
    .select()
    .from(media)
    .orderBy(asc(media.sortOrder), asc(media.createdAt), asc(media.id));
}

/**
 * Returns the count of media items currently stored in the database.
 */
export async function getMediaCount(): Promise<number> {
  await requireAdmin();

  const [row] = await db.select({ total: count() }).from(media);
  return row?.total ?? 0;
}

/**
 * Creates a batch of 1 to 20 media items in selection order.
 * - Enforces MEDIA_MAX_ITEMS capacity.
 * - Verifies every file and poster exists in S3 via headObject.
 * - Verifies Content-Type and size limits for every file before insertion.
 * - Rejects the whole batch if any verification fails.
 * - Sequentially assigns sortOrder after the current maximum in one statement.
 */
export async function createMediaItems(
  items: MediaItemInput[],
): Promise<Media[]> {
  await requireAdmin();

  if (items.length === 0) {
    return [];
  }

  // 1. Capacity check
  const currentTotal = await getMediaCount();
  if (currentTotal + items.length > MEDIA_MAX_ITEMS) {
    throw new MediaValidationError(
      `Adding ${items.length} item(s) would exceed the maximum capacity of ${MEDIA_MAX_ITEMS} media items (currently ${currentTotal} stored).`,
    );
  }

  // 2. Storage verification via headObject
  for (const item of items) {
    const fileHead = await headObject(item.fileKey);
    if (!fileHead.exists) {
      throw new MediaValidationError(
        `File was not found in storage: ${item.fileKey}`,
      );
    }

    if (item.type === "image") {
      const isAllowedImageType =
        fileHead.contentType &&
        (MEDIA_IMAGE_CONTENT_TYPES as readonly string[]).includes(
          fileHead.contentType,
        );
      if (!isAllowedImageType) {
        throw new MediaValidationError(
          `Image file content type must be JPEG, PNG, or WebP. Found: ${fileHead.contentType ?? "unknown"}`,
        );
      }
      if (
        typeof fileHead.size === "number" &&
        fileHead.size > MEDIA_IMAGE_MAX_BYTES
      ) {
        throw new MediaValidationError(
          `Image size exceeds 10 MB limit: ${item.fileKey}`,
        );
      }
    } else if (item.type === "video") {
      const isAllowedVideoType =
        fileHead.contentType &&
        (MEDIA_VIDEO_CONTENT_TYPES as readonly string[]).includes(
          fileHead.contentType,
        );
      if (!isAllowedVideoType) {
        throw new MediaValidationError(
          `Video file content type must be MP4 or WebM. Found: ${fileHead.contentType ?? "unknown"}`,
        );
      }
      if (
        typeof fileHead.size === "number" &&
        fileHead.size > MEDIA_VIDEO_MAX_BYTES
      ) {
        throw new MediaValidationError(
          `Video size exceeds 100 MB limit: ${item.fileKey}`,
        );
      }

      // Verify poster
      if (!item.posterKey) {
        throw new MediaValidationError(
          `Missing required video poster for ${item.fileKey}`,
        );
      }

      const posterHead = await headObject(item.posterKey);
      if (!posterHead.exists) {
        throw new MediaValidationError(
          `Video poster was not found in storage: ${item.posterKey}`,
        );
      }
      const isAllowedPosterType =
        posterHead.contentType &&
        (MEDIA_IMAGE_CONTENT_TYPES as readonly string[]).includes(
          posterHead.contentType,
        );
      if (!isAllowedPosterType) {
        throw new MediaValidationError(
          `Video poster content type must be JPEG, PNG, or WebP. Found: ${posterHead.contentType ?? "unknown"}`,
        );
      }
      if (
        typeof posterHead.size === "number" &&
        posterHead.size > MEDIA_IMAGE_MAX_BYTES
      ) {
        throw new MediaValidationError(
          `Video poster size exceeds 10 MB limit: ${item.posterKey}`,
        );
      }
    }
  }

  // 3. Compute starting sortOrder
  const [maxRow] = await db
    .select({
      maxSortOrder: sql<number>`COALESCE(MAX(${media.sortOrder}), 0)::int`,
    })
    .from(media);
  const startSortOrder = maxRow?.maxSortOrder ?? 0;

  // 4. Insert all items in a single statement
  const rowsToInsert = items.map((item, index) => ({
    type: item.type,
    fileKey: item.fileKey,
    posterKey: item.posterKey ?? null,
    width: item.width,
    height: item.height,
    durationSeconds: item.durationSeconds ?? null,
    caption: item.caption ?? null,
    sortOrder: startSortOrder + index + 1,
  }));

  return db.insert(media).values(rowsToInsert).returning();
}

/**
 * Updates the caption of an existing media item.
 */
export async function updateMediaCaption(
  input: UpdateMediaCaptionInput,
): Promise<Media> {
  await requireAdmin();

  const [updated] = await db
    .update(media)
    .set({
      caption: input.caption ?? null,
    })
    .where(eq(media.id, input.id))
    .returning();

  if (!updated) {
    throw new MediaValidationError("Media item not found.");
  }

  return updated;
}

/**
 * Deletes a media item from the database, then removes its S3 object(s).
 * S3 failures do not fail the database deletion.
 */
export async function deleteMedia(id: string): Promise<Media> {
  await requireAdmin();

  const [deleted] = await db.delete(media).where(eq(media.id, id)).returning();

  if (!deleted) {
    throw new MediaValidationError("Media item not found.");
  }

  // Delete primary file
  try {
    await deleteObject(deleted.fileKey);
  } catch {
    // S3 cleanup failure does not fail the database deletion
  }

  // Delete poster if present
  if (deleted.posterKey) {
    try {
      await deleteObject(deleted.posterKey);
    } catch {
      // S3 cleanup failure does not fail the database deletion
    }
  }

  return deleted;
}

/**
 * Deletes multiple media items from the database in ONE statement, then deletes their files and posters
 * from storage 5 at a time. Storage failures do not fail the call but are counted.
 * IDs that no longer exist are simply not counted.
 */
export async function deleteMediaItems(
  ids: string[],
): Promise<{ deleted: number; storageFailures: number }> {
  await requireAdmin();

  if (ids.length === 0) {
    return { deleted: 0, storageFailures: 0 };
  }

  const deletedRows = await db
    .delete(media)
    .where(inArray(media.id, ids))
    .returning({
      id: media.id,
      fileKey: media.fileKey,
      posterKey: media.posterKey,
    });

  if (deletedRows.length === 0) {
    return { deleted: 0, storageFailures: 0 };
  }

  // Collect all keys to delete from storage
  const keysToDelete: string[] = [];
  for (const row of deletedRows) {
    keysToDelete.push(row.fileKey);
    if (row.posterKey) {
      keysToDelete.push(row.posterKey);
    }
  }

  // Delete each file and poster from storage, 5 at a time
  let storageFailures = 0;
  for (let i = 0; i < keysToDelete.length; i += 5) {
    const chunk = keysToDelete.slice(i, i + 5);
    await Promise.all(
      chunk.map(async (key) => {
        try {
          await deleteObject(key);
        } catch {
          storageFailures++;
        }
      }),
    );
  }

  return {
    deleted: deletedRows.length,
    storageFailures,
  };
}

/**
 * Atomically reorders media items using a single UPDATE statement with CASE.
 * Rejects partial or unknown ID lists to guarantee order integrity.
 */
export async function reorderMedia(input: ReorderMediaInput): Promise<void> {
  await requireAdmin();

  if (input.ids.length === 0) {
    return;
  }

  // Fetch all existing media IDs to verify list completeness
  const existingRows = await db.select({ id: media.id }).from(media);
  if (existingRows.length !== input.ids.length) {
    throw new MediaValidationError(
      `Reorder list must contain all ${existingRows.length} media items. Received ${input.ids.length}.`,
    );
  }

  const existingIdSet = new Set(existingRows.map((r) => r.id));
  for (const id of input.ids) {
    if (!existingIdSet.has(id)) {
      throw new MediaValidationError(`Unknown media ID in reorder list: ${id}`);
    }
  }

  await db.execute(
    buildReorderStatement({
      table: media,
      ids: input.ids,
      refreshUpdatedAt: false,
    }),
  );
}
