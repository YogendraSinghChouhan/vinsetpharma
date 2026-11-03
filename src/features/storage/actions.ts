"use server";

import { requireAdmin } from "@/features/auth/data";
import { GENERIC_ACTION_ERROR, logActionError } from "@/lib/server-error";
import { uploadRequestSchema } from "./schema";
import { createUploadUrl, type UploadUrlResult } from "./server/service";

export type RequestImageUploadResult =
  | { success: true; data: UploadUrlResult }
  | { success: false; error: string };

export async function requestImageUpload(
  input: unknown,
): Promise<RequestImageUploadResult> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: an admin session is required to upload images.",
    };
  }

  const parseResult = uploadRequestSchema.safeParse(input);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Invalid upload request parameters.",
    };
  }

  try {
    const data = await createUploadUrl(parseResult.data);
    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    logActionError("storage.requestUpload", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}
