import "server-only";

import { asc, count, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { buildReorderStatement } from "@/db/reorder";
import { requireAdmin } from "@/features/auth/data";
import {
  HERO_ALLOWED_CONTENT_TYPES,
  HERO_IMAGE_MAX_BYTES,
} from "@/features/storage/constants";
import { deleteObject, headObject } from "@/features/storage/server/service";
import { HERO_MAX_SLIDES } from "./constants";
import { type HeroSlide, heroSlides } from "./schema";
import type {
  HeroSlideItemInput,
  ReorderHeroSlidesInput,
  UpdateHeroSlideInput,
} from "./validation";

export class HeroValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HeroValidationError";
  }
}

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
 * Returns all hero slides ordered by sortOrder ascending, then createdAt, then id.
 * Falls back to an empty list if the database table has not been created yet.
 */
export async function listHeroSlides(): Promise<HeroSlide[]> {
  await requireAdmin();

  try {
    return await db
      .select()
      .from(heroSlides)
      .orderBy(
        asc(heroSlides.sortOrder),
        asc(heroSlides.createdAt),
        asc(heroSlides.id),
      );
  } catch (error) {
    if (isTableMissingError(error)) {
      return [];
    }
    throw error;
  }
}

/**
 * Returns the count of hero slides currently stored in the database.
 * Falls back to 0 if the database table has not been created yet.
 */
export async function getHeroSlidesCount(): Promise<number> {
  await requireAdmin();

  try {
    const [row] = await db.select({ total: count() }).from(heroSlides);
    return row?.total ?? 0;
  } catch (error) {
    if (isTableMissingError(error)) {
      return 0;
    }
    throw error;
  }
}

/**
 * Creates a batch of 1 to 6 hero slides in insertion order.
 * - Enforces HERO_MAX_SLIDES capacity.
 * - Verifies every file exists in storage via headObject.
 * - Verifies Content-Type and size limits before insertion.
 * - Rejects the whole batch if any verification fails.
 * - Sequentially assigns sortOrder after current maximum in one statement.
 */
export async function createHeroSlides(
  items: HeroSlideItemInput[],
): Promise<HeroSlide[]> {
  await requireAdmin();

  if (items.length === 0) {
    return [];
  }

  // 1. Capacity check
  const currentTotal = await getHeroSlidesCount();
  if (currentTotal + items.length > HERO_MAX_SLIDES) {
    throw new HeroValidationError(
      `Adding ${items.length} slide(s) would exceed the maximum capacity of ${HERO_MAX_SLIDES} hero slides (currently ${currentTotal} stored).`,
    );
  }

  // 2. Storage verification via headObject for all items in batch
  for (const item of items) {
    const fileHead = await headObject(item.imageKey);
    if (!fileHead.exists) {
      throw new HeroValidationError(
        `Image was not found in storage: ${item.imageKey}`,
      );
    }

    const isAllowedType =
      fileHead.contentType &&
      (HERO_ALLOWED_CONTENT_TYPES as readonly string[]).includes(
        fileHead.contentType,
      );
    if (!isAllowedType) {
      throw new HeroValidationError(
        `Image content type must be JPEG, PNG, or WebP. Found: ${fileHead.contentType ?? "unknown"}`,
      );
    }

    if (
      typeof fileHead.size === "number" &&
      fileHead.size > HERO_IMAGE_MAX_BYTES
    ) {
      throw new HeroValidationError(
        `Image size exceeds 10 MB limit: ${item.imageKey}`,
      );
    }
  }

  // 3. Compute starting sortOrder and insert in a single statement
  try {
    const [maxRow] = await db
      .select({
        maxSortOrder: sql<number>`COALESCE(MAX(${heroSlides.sortOrder}), 0)::int`,
      })
      .from(heroSlides);
    const startSortOrder = maxRow?.maxSortOrder ?? 0;

    const rowsToInsert = items.map((item, index) => ({
      imageKey: item.imageKey,
      width: item.width,
      height: item.height,
      alt: item.alt ?? null,
      focus: item.focus,
      sortOrder: startSortOrder + index + 1,
    }));

    return await db.insert(heroSlides).values(rowsToInsert).returning();
  } catch (error) {
    if (isTableMissingError(error)) {
      throw new HeroValidationError(
        "The 'hero_slides' database table does not exist. Please run 'bun run db:migrate' to create the table.",
      );
    }
    throw error;
  }
}

/**
 * Updates the alt text and focus of an existing hero slide.
 */
export async function updateHeroSlide(
  input: UpdateHeroSlideInput,
): Promise<HeroSlide> {
  await requireAdmin();

  try {
    const [updated] = await db
      .update(heroSlides)
      .set({
        alt: input.alt ?? null,
        focus: input.focus,
      })
      .where(eq(heroSlides.id, input.id))
      .returning();

    if (!updated) {
      throw new HeroValidationError("Hero slide not found.");
    }

    return updated;
  } catch (error) {
    if (isTableMissingError(error)) {
      throw new HeroValidationError(
        "The 'hero_slides' database table does not exist. Please run 'bun run db:migrate' to create the table.",
      );
    }
    throw error;
  }
}

/**
 * Deletes a hero slide from the database, then removes its S3 image.
 * S3 cleanup failures do not fail the database deletion.
 */
export async function deleteHeroSlide(id: string): Promise<HeroSlide> {
  await requireAdmin();

  let deleted: HeroSlide | undefined;
  try {
    const [row] = await db
      .delete(heroSlides)
      .where(eq(heroSlides.id, id))
      .returning();
    deleted = row;
  } catch (error) {
    if (isTableMissingError(error)) {
      throw new HeroValidationError(
        "The 'hero_slides' database table does not exist. Please run 'bun run db:migrate' to create the table.",
      );
    }
    throw error;
  }

  if (!deleted) {
    throw new HeroValidationError("Hero slide not found.");
  }

  try {
    await deleteObject(deleted.imageKey);
  } catch {
    // S3 cleanup failure does not fail the database deletion
  }

  return deleted;
}

/**
 * Atomically reorders hero slides using a single UPDATE statement with CASE.
 * Rejects partial or unknown ID lists to guarantee order integrity.
 */
export async function reorderHeroSlides(
  input: ReorderHeroSlidesInput,
): Promise<void> {
  await requireAdmin();

  if (input.ids.length === 0) {
    return;
  }

  try {
    // Fetch all existing slide IDs to verify list completeness
    const existingRows = await db
      .select({ id: heroSlides.id })
      .from(heroSlides);

    if (existingRows.length !== input.ids.length) {
      throw new HeroValidationError(
        `Reorder list must contain all ${existingRows.length} hero slides. Received ${input.ids.length}.`,
      );
    }

    const existingIdSet = new Set(existingRows.map((r) => r.id));
    for (const id of input.ids) {
      if (!existingIdSet.has(id)) {
        throw new HeroValidationError(
          `Unknown hero slide ID in reorder list: ${id}`,
        );
      }
    }

    await db.execute(
      buildReorderStatement({
        table: heroSlides,
        ids: input.ids,
        refreshUpdatedAt: false,
      }),
    );
  } catch (error) {
    if (isTableMissingError(error)) {
      throw new HeroValidationError(
        "The 'hero_slides' database table does not exist. Please run 'bun run db:migrate' to create the table.",
      );
    }
    throw error;
  }
}
