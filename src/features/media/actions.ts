"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/features/auth/data";
import {
  createUploadUrl,
  type UploadUrlResult,
} from "@/features/storage/server/service";
import { GENERIC_ACTION_ERROR, logActionError } from "@/lib/server-error";
import { MEDIA_CACHE_TAG, MEDIA_MAX_ITEMS } from "./constants";
import * as mediaData from "./data";
import type { Media } from "./schema";
import {
  createMediaBatchSchema,
  mediaIdSchema,
  reorderMediaSchema,
  requestMediaUploadSchema,
  updateMediaCaptionSchema,
} from "./validation";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Generates a presigned S3 upload URL for a photo or video under the "media" purpose.
 * Validates admin session, checks that total items < MEDIA_MAX_ITEMS, and enforces file limits.
 */
export async function requestMediaUpload(
  input: unknown,
): Promise<ActionResult<UploadUrlResult>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required to upload media.",
    };
  }

  const parseResult = requestMediaUploadSchema.safeParse(input);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Invalid upload request parameters.",
    };
  }

  try {
    const currentCount = await mediaData.getMediaCount();
    if (currentCount >= MEDIA_MAX_ITEMS) {
      return {
        success: false,
        error: `Media capacity limit reached. Maximum ${MEDIA_MAX_ITEMS} items allowed. Delete existing items to upload new ones.`,
      };
    }

    const data = await createUploadUrl({
      purpose: "media",
      contentType: parseResult.data.contentType,
      size: parseResult.data.size,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    logActionError("media.requestUpload", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}

/**
 * Registers a batch of verified uploaded media items in the database.
 */
export async function createMediaItems(
  input: unknown,
): Promise<ActionResult<Media[]>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error:
        "Unauthorized: an admin session is required to create media items.",
    };
  }

  const parseResult = createMediaBatchSchema.safeParse(input);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Invalid media batch payload.",
    };
  }

  try {
    const created = await mediaData.createMediaItems(parseResult.data);
    updateTag(MEDIA_CACHE_TAG);
    return {
      success: true,
      data: created,
    };
  } catch (error: unknown) {
    if (error instanceof mediaData.MediaValidationError) {
      return {
        success: false,
        error: error.message,
      };
    }
    logActionError("media.createItems", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}

/**
 * Updates the caption of an existing media item.
 */
export async function updateMediaCaption(
  input: unknown,
): Promise<ActionResult<Media>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required to update captions.",
    };
  }

  const parseResult = updateMediaCaptionSchema.safeParse(input);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Invalid caption update parameters.",
    };
  }

  try {
    const updated = await mediaData.updateMediaCaption(parseResult.data);
    updateTag(MEDIA_CACHE_TAG);
    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    if (error instanceof mediaData.MediaValidationError) {
      return {
        success: false,
        error: error.message,
      };
    }
    logActionError("media.updateCaption", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}

/**
 * Deletes a media item from the database and removes its S3 objects.
 */
export async function deleteMedia(
  input: unknown,
): Promise<ActionResult<Media>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required to delete media.",
    };
  }

  const parseResult = mediaIdSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: "Invalid media ID format.",
    };
  }

  try {
    const deleted = await mediaData.deleteMedia(parseResult.data);
    updateTag(MEDIA_CACHE_TAG);
    return {
      success: true,
      data: deleted,
    };
  } catch (error: unknown) {
    if (error instanceof mediaData.MediaValidationError) {
      return {
        success: false,
        error: error.message,
      };
    }
    logActionError("media.delete", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}

/**
 * Reorders all media items atomically according to the provided ID list.
 */
export async function reorderMedia(
  input: unknown,
): Promise<ActionResult<void>> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required to reorder media.",
    };
  }

  const parseResult = reorderMediaSchema.safeParse(input);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Invalid media reorder list.",
    };
  }

  try {
    await mediaData.reorderMedia(parseResult.data);
    updateTag(MEDIA_CACHE_TAG);
    return {
      success: true,
      data: undefined,
    };
  } catch (error: unknown) {
    if (error instanceof mediaData.MediaValidationError) {
      return {
        success: false,
        error: error.message,
      };
    }
    logActionError("media.reorder", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}
