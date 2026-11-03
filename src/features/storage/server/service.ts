import "server-only";

import { randomUUID } from "node:crypto";
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/config/env";
import {
  CONTENT_TYPE_TO_EXTENSION,
  isValidStorageKey,
  MEDIA_PRESIGNED_EXPIRY_SECONDS,
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

export interface HeadObjectResult {
  exists: boolean;
  contentType?: string;
  size?: number;
}

export async function createUploadUrl(
  input: UploadRequestInput,
): Promise<UploadUrlResult> {
  const extension = CONTENT_TYPE_TO_EXTENSION[input.contentType];
  if (!extension) {
    throw new Error(`Unsupported content type: ${input.contentType}`);
  }

  const key = `${input.purpose}/${randomUUID()}.${extension}`;
  const expiry =
    input.purpose === "media"
      ? MEDIA_PRESIGNED_EXPIRY_SECONDS
      : PRESIGNED_URL_EXPIRY_SECONDS;

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ContentType: input.contentType,
    ContentLength: input.size,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: expiry,
  });

  return {
    uploadUrl,
    key,
  };
}

/**
 * Checks if an object exists in the S3 bucket and returns its metadata.
 * Validates the storage key pattern before dispatching network request.
 * Does not throw when the object does not exist.
 */
export async function headObject(key: string): Promise<HeadObjectResult> {
  if (!isValidStorageKey(key)) {
    return { exists: false };
  }

  try {
    const response = await s3Client.send(
      new HeadObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
      }),
    );

    return {
      exists: true,
      contentType: response.ContentType,
      size: response.ContentLength,
    };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      (error.name === "NotFound" || error.name === "NoSuchKey")
    ) {
      return { exists: false };
    }

    if (
      error &&
      typeof error === "object" &&
      "$metadata" in error &&
      (error as { $metadata?: { httpStatusCode?: number } }).$metadata
        ?.httpStatusCode === 404
    ) {
      return { exists: false };
    }

    throw error;
  }
}

/**
 * Deletes an S3 object matching any valid storage key pattern.
 * Validates the key format before dispatching the deletion command.
 * Idempotent: ignores NoSuchKey errors from S3-compatible providers.
 */
export async function deleteObject(key: string): Promise<void> {
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

/**
 * Alias for deleteObject for backwards compatibility.
 */
export const deleteImage = deleteObject;
