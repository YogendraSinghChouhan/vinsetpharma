"use client";

import {
  IconAlertCircle,
  IconCheck,
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

const MAX_SIZE_MB = Math.round(MAX_IMAGE_SIZE_BYTES / (1024 * 1024));

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
  const [isDragOver, setIsDragOver] = useState(false);
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

  async function uploadFile(file: File) {
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
        `File size exceeds the ${MAX_SIZE_MB} MB limit. Please select a smaller file.`,
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

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }

  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    if (disabled || isUploading) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragOver(true);
    }
  }

  function handleDragLeave(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }

  function handleRemove() {
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Only clears the field value; the previous S3 object is deleted after save
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

      {/* State 1: Uploading with real progress spinner and announcement */}
      {isUploading ? (
        <output
          aria-live="polite"
          className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary/50 bg-primary/5 p-6 text-center"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Spinner className="size-6 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Uploading Image...
            </p>
            <p className="text-xs text-muted-foreground">
              Transferring directly to secure cloud storage
            </p>
          </div>
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-primary/20">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
          </div>
        </output>
      ) : value && previewUrl ? (
        /* State 2: Success Preview with pocket-style well, Replace and Remove */
        <div className="flex flex-col gap-3">
          <div className="relative aspect-video sm:aspect-16/10 w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface-tint p-2 shadow-[inset_0_2px_4px_rgba(0,40,50,0.05)]">
            <Image
              src={previewUrl}
              alt="Current image preview"
              fill
              sizes="(max-width: 640px) 100vw, 448px"
              className={cn(
                purpose === "blogs"
                  ? "object-cover rounded-lg"
                  : "object-contain p-2",
              )}
            />
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-background/90 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 shadow-xs border border-emerald-500/30">
              <IconCheck className="size-3" aria-hidden="true" />
              <span>Uploaded</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTriggerSelect}
              disabled={disabled || isUploading}
              className="min-h-[44px] sm:min-h-9 text-xs font-semibold"
            >
              <IconUpload className="size-4 mr-1.5" aria-hidden="true" />
              <span>Replace Image</span>
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || isUploading}
              className="min-h-[44px] sm:min-h-9 text-xs font-semibold"
            >
              <IconTrash className="size-4 mr-1.5" aria-hidden="true" />
              <span>Remove</span>
            </Button>
          </div>
        </div>
      ) : (
        /* State 3 & 4: Idle & Drag-Over Pocket Drop Zone */
        <button
          type="button"
          onClick={disabled ? undefined : handleTriggerSelect}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          disabled={disabled || isUploading}
          className={cn(
            "group relative flex min-h-[180px] w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/80 bg-surface-tint/40 p-6 text-center cursor-pointer transition-all",
            "hover:border-primary/60 hover:bg-surface-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary",
            isDragOver &&
              "border-primary bg-primary/10 ring-4 ring-primary/20 scale-[0.99]",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          )}
          aria-label={ariaLabel ?? "Upload image drop zone"}
        >
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-2xs transition-transform group-hover:scale-105",
              isDragOver && "border-primary bg-primary text-primary-foreground",
            )}
          >
            <IconPhoto className="size-6" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {isDragOver
                ? "Drop image to upload"
                : "Drag & drop your image here, or browse"}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPEG, or WebP up to {MAX_SIZE_MB} MB
            </p>
          </div>

          <span
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-2xs transition-colors group-hover:bg-accent group-hover:text-accent-foreground"
            aria-hidden="true"
          >
            <IconUpload className="size-3.5 mr-1.5" />
            <span>Choose Image</span>
          </span>
        </button>
      )}

      {/* State 5: Error Banner with role="alert" */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-center justify-between gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive"
        >
          <div className="flex items-center gap-2">
            <IconAlertCircle className="size-4 shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-[11px] font-semibold underline hover:text-destructive/80 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
