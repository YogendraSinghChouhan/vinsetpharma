"use client";

import {
  IconAlertCircle,
  IconPhoto,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { requestImageUpload } from "../actions";
import {
  ALLOWED_CONTENT_TYPES,
  type AllowedContentType,
  MAX_IMAGE_SIZE_BYTES,
  type UploadPurpose,
} from "../constants";
import { getImageUrl } from "../image-url";

export interface ImageUploaderProps {
  value: string | null;
  onChange: (key: string | null) => void;
  purpose?: UploadPurpose;
  disabled?: boolean;
  id?: string;
  name?: string;
  publicBaseUrl?: string;
  className?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-required"?: boolean | "true" | "false";
  "aria-label"?: string;
}

export function ImageUploader({
  value,
  onChange,
  purpose = "products",
  disabled = false,
  id,
  name,
  publicBaseUrl,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  "aria-label": ariaLabel,
}: ImageUploaderProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compute preview URL safely when a key is present
  let previewUrl: string | null = null;
  if (value) {
    try {
      previewUrl = getImageUrl(value, publicBaseUrl);
    } catch {
      previewUrl = null;
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setErrorMessage(null);

    // Client-side format check
    const isAllowedFormat = ALLOWED_CONTENT_TYPES.includes(
      file.type as AllowedContentType,
    );
    if (!isAllowedFormat) {
      setErrorMessage(
        "Invalid file format. Allowed formats are JPEG, PNG, and WebP.",
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Client-side size limit check
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setErrorMessage(
        "File size exceeds the 5 MB limit. Please select a smaller file.",
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setIsUploading(true);

    try {
      // 1. Request presigned upload URL via server action
      const uploadRequest = await requestImageUpload({
        purpose,
        contentType: file.type,
        size: file.size,
      });

      if (!uploadRequest.success) {
        throw new Error(uploadRequest.error);
      }

      const { uploadUrl, key } = uploadRequest.data;

      // 2. Direct PUT upload from browser to S3-compatible storage
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(
          `Direct storage upload failed with HTTP status ${uploadResponse.status}.`,
        );
      }

      // 3. Update controlled value with object key
      onChange(key);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to upload image.";
      setErrorMessage(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleRemove() {
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Only clears the field value; the previous S3 object is deleted by the calling feature after save.
    onChange(null);
  }

  function handleTriggerSelect() {
    fileInputRef.current?.click();
  }

  const isRequired = ariaRequired === true || ariaRequired === "true";

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      data-slot="image-uploader"
    >
      <input
        ref={fileInputRef}
        id={inputId}
        name={name}
        type="file"
        accept={ALLOWED_CONTENT_TYPES.join(",")}
        disabled={disabled || isUploading}
        required={isRequired}
        className="sr-only"
        onChange={handleFileChange}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        aria-label={ariaLabel ?? "Upload image file"}
      />

      {isUploading ? (
        <output
          aria-live="polite"
          className="flex min-h-[160px] flex-col items-center justify-center gap-2 border border-border bg-muted/40 p-6 text-center"
        >
          <Spinner className="size-6 text-primary" />
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Uploading Image...
          </p>
          <p className="text-xs text-muted-foreground">
            Uploading directly to secure storage
          </p>
        </output>
      ) : value && previewUrl ? (
        <div className="flex flex-col gap-3">
          <div className="relative aspect-video w-full max-w-sm overflow-hidden border border-border bg-muted">
            <Image
              src={previewUrl}
              alt="Current image preview"
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-cover"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTriggerSelect}
              disabled={disabled || isUploading}
            >
              <IconUpload className="size-4" aria-hidden="true" />
              <span>Replace Image</span>
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              <IconTrash className="size-4" aria-hidden="true" />
              <span>Remove</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-border bg-muted/20 p-6 text-center transition-colors hover:bg-muted/40">
          <div className="flex size-10 items-center justify-center border border-border bg-background text-muted-foreground">
            <IconPhoto className="size-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-foreground">
              Select an image file
            </span>
            <span className="text-[11px] text-muted-foreground">
              JPEG, PNG, or WebP up to 5 MB
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTriggerSelect}
            disabled={disabled || isUploading}
          >
            <IconUpload className="size-4" aria-hidden="true" />
            <span>Choose Image</span>
          </Button>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="flex items-center gap-1.5 text-xs font-medium text-destructive"
        >
          <IconAlertCircle className="size-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
