"use server";

import { requireAdmin } from "@/features/auth/data";
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
    const message =
      error instanceof Error ? error.message : "Failed to generate upload URL.";
    return {
      success: false,
      error: message,
    };
  }
}
