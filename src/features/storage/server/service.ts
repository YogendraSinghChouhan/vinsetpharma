import "server-only";

import { randomUUID } from "node:crypto";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/config/env";
import {
  CONTENT_TYPE_TO_EXTENSION,
  isValidStorageKey,
  PRESIGNED_URL_EXPIRY_SECONDS,
} from "../constants";
import { getImageUrl } from "../image-url";
import type { UploadRequestInput } from "../schema";
import { s3Client } from "./client";

export { getImageUrl };

export interface UploadUrlResult {
  uploadUrl: string;
  key: string;
}

export async function createUploadUrl(
  input: UploadRequestInput,
): Promise<UploadUrlResult> {
  const extension = CONTENT_TYPE_TO_EXTENSION[input.contentType];
  const key = `${input.purpose}/${randomUUID()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ContentType: input.contentType,
    ContentLength: input.size,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_EXPIRY_SECONDS,
  });

  return {
    uploadUrl,
    key,
  };
}

export async function deleteImage(key: string): Promise<void> {
  if (!isValidStorageKey(key)) {
    throw new Error(
      `Invalid storage key format. Expected "purpose/uuid.ext", received: "${key}"`,
    );
  }

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
      }),
    );
  } catch (error: unknown) {
    // S3 DeleteObject is idempotent; ignore NoSuchKey errors from S3-compatible providers.
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "NoSuchKey"
    ) {
      return;
    }
    throw error;
  }
}
