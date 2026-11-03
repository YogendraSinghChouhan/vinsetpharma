"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/features/auth/data";
import {
  createUploadUrl,
  type UploadUrlResult,
} from "@/features/storage/server/service";
import { GENERIC_ACTION_ERROR, logActionError } from "@/lib/server-error";
import { HERO_CACHE_TAG, HERO_MAX_SLIDES } from "./constants";
import * as heroData from "./data";
import type { HeroSlide } from "./schema";
import {
  createHeroSlidesBatchSchema,
  heroSlideIdSchema,
  reorderHeroSlidesSchema,
  requestHeroUploadSchema,
  updateHeroSlideSchema,
} from "./validation";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Generates a presigned S3 upload URL for an image under the "hero" purpose.
 * Validates admin session, checks that total slides < HERO_MAX_SLIDES, and enforces file limits.
 */
export async function requestHeroUpload(
  input: unknown,
): Promise<ActionResult<UploadUrlResult>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error:
        "Unauthorized: an admin session is required to upload hero slides.",
    };
  }

  const parseResult = requestHeroUploadSchema.safeParse(input);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Invalid upload request parameters.",
    };
  }

  try {
    const currentCount = await heroData.getHeroSlidesCount();
    if (currentCount >= HERO_MAX_SLIDES) {
      return {
        success: false,
        error: `Hero banner capacity reached. Maximum ${HERO_MAX_SLIDES} slides allowed. Delete an existing slide to upload a new one.`,
      };
    }

    const data = await createUploadUrl({
      purpose: "hero",
      contentType: parseResult.data.contentType,
      size: parseResult.data.size,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    logActionError("hero.requestUpload", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}

/**
 * Registers a batch of verified uploaded hero slides in the database.
 */
export async function createHeroSlides(
  input: unknown,
): Promise<ActionResult<HeroSlide[]>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error:
        "Unauthorized: an admin session is required to create hero slides.",
    };
  }

  const parseResult = createHeroSlidesBatchSchema.safeParse(input);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Invalid hero slides batch payload.",
    };
  }

  try {
    const created = await heroData.createHeroSlides(parseResult.data);
    updateTag(HERO_CACHE_TAG);
    return {
      success: true,
      data: created,
    };
  } catch (error: unknown) {
    if (error instanceof heroData.HeroValidationError) {
      return {
        success: false,
        error: error.message,
      };
    }
    logActionError("hero.createSlides", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}

/**
 * Updates the alt text and focus crop of an existing hero slide.
 */
export async function updateHeroSlide(
  input: unknown,
): Promise<ActionResult<HeroSlide>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error:
        "Unauthorized: an admin session is required to update hero slides.",
    };
  }

  const parseResult = updateHeroSlideSchema.safeParse(input);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Invalid slide update parameters.",
    };
  }

  try {
    const updated = await heroData.updateHeroSlide(parseResult.data);
    updateTag(HERO_CACHE_TAG);
    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    if (error instanceof heroData.HeroValidationError) {
      return {
        success: false,
        error: error.message,
      };
    }
    logActionError("hero.updateSlide", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}

/**
 * Deletes a hero slide from the database and removes its S3 image.
 */
export async function deleteHeroSlide(
  input: unknown,
): Promise<ActionResult<HeroSlide>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error:
        "Unauthorized: an admin session is required to delete hero slides.",
    };
  }

  const parseResult = heroSlideIdSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: "Invalid hero slide ID format.",
    };
  }

  try {
    const deleted = await heroData.deleteHeroSlide(parseResult.data);
    updateTag(HERO_CACHE_TAG);
    return {
      success: true,
      data: deleted,
    };
  } catch (error: unknown) {
    if (error instanceof heroData.HeroValidationError) {
      return {
        success: false,
        error: error.message,
      };
    }
    logActionError("hero.deleteSlide", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}

/**
 * Atomically reorders hero slides.
 */
export async function reorderHeroSlides(
  input: unknown,
): Promise<ActionResult<void>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error:
        "Unauthorized: an admin session is required to reorder hero slides.",
    };
  }

  const parseResult = reorderHeroSlidesSchema.safeParse(input);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Invalid hero slides reorder list.",
    };
  }

  try {
    await heroData.reorderHeroSlides(parseResult.data);
    updateTag(HERO_CACHE_TAG);
    return {
      success: true,
      data: undefined,
    };
  } catch (error: unknown) {
    if (error instanceof heroData.HeroValidationError) {
      return {
        success: false,
        error: error.message,
      };
    }
    logActionError("hero.reorderSlides", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}
