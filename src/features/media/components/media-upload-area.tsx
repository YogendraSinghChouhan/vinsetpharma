"use client";

import {
  IconAlertCircle,
  IconCheck,
  IconMovie,
  IconPhoto,
  IconRefresh,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { createMediaItems, requestMediaUpload } from "../actions";
import { MEDIA_MAX_BATCH_SIZE } from "../constants";
import type { Media } from "../schema";
import { formatFileSize, validateMediaFile } from "../utils";

interface QueueItem {
  id: string;
  file: File;
  type: "image" | "video";
  status:
    | "queued"
    | "extracting"
    | "uploading"
    | "registering"
    | "done"
    | "error";
  progress: number;
  error?: string;
  abortFn?: () => void;
  fileKey?: string;
  posterKey?: string;
  metadata?: {
    width: number;
    height: number;
    durationSeconds?: number;
  };
}

interface MediaUploadAreaProps {
  currentCount: number;
  maxCount: number;
  onItemsCreated: (items: Media[]) => void;
}

export function MediaUploadArea({
  currentCount,
  maxCount,
  onItemsCreated,
}: MediaUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [liveMessage, setLiveMessage] = useState("");

  const queueRef = useRef<QueueItem[]>(queue);
  queueRef.current = queue;

  const remainingSlots = Math.max(0, maxCount - currentCount);

  // Helper to update a queue item
  const updateItem = useCallback((id: string, patch: Partial<QueueItem>) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

  // XHR upload wrapper
  const uploadViaXhr = useCallback(
    ({
      url,
      blob,
      contentType,
      onProgress,
    }: {
      url: string;
      blob: Blob;
      contentType: string;
      onProgress: (percent: number) => void;
    }) => {
      const xhr = new XMLHttpRequest();
      const promise = new Promise<void>((resolve, reject) => {
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable && evt.total > 0) {
            const percent = Math.round((evt.loaded / evt.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Storage PUT failed with status ${xhr.status}.`));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network connection error during upload."));
        };

        xhr.onabort = () => {
          reject(new Error("Upload cancelled."));
        };

        xhr.open("PUT", url);
        xhr.setRequestHeader("Content-Type", contentType);
        xhr.send(blob);
      });

      return {
        promise,
        abort: () => xhr.abort(),
      };
    },
    [],
  );

  // Extract dimensions for image
  const extractImageMetadata = useCallback(
    async (file: File): Promise<{ width: number; height: number }> => {
      if ("createImageBitmap" in window) {
        const bitmap = await createImageBitmap(file);
        const { width, height } = bitmap;
        bitmap.close();
        return { width, height };
      }
      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to load image. The file may be corrupt."));
        };
        img.src = url;
      });
    },
    [],
  );

  // Extract video dimensions and export canvas poster frame
  const extractVideoMetadataAndPoster = useCallback(
    async (
      file: File,
    ): Promise<{
      width: number;
      height: number;
      durationSeconds: number;
      posterBlob: Blob;
    }> => {
      return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.muted = true;
        video.playsInline = true;

        const url = URL.createObjectURL(file);

        const cleanup = () => {
          URL.revokeObjectURL(url);
          video.remove();
        };

        video.onerror = () => {
          cleanup();
          reject(
            new Error(
              "This video format is not supported by your browser. Export it as MP4 (H.264) and try again.",
            ),
          );
        };

        video.onloadedmetadata = () => {
          const duration = video.duration;
          const width = video.videoWidth;
          const height = video.videoHeight;

          if (
            !width ||
            !height ||
            !Number.isFinite(duration) ||
            duration <= 0
          ) {
            cleanup();
            reject(new Error("Unable to read video dimensions or duration."));
            return;
          }

          // Seek to min(1s, half the duration)
          const seekTime = Math.min(1, duration / 2);
          video.currentTime = seekTime;
        };

        video.onseeked = () => {
          try {
            const width = video.videoWidth;
            const height = video.videoHeight;
            const durationSeconds = Math.max(1, Math.round(video.duration));

            // Max poster width 1280px
            const maxPosterWidth = 1280;
            let posterWidth = width;
            let posterHeight = height;

            if (posterWidth > maxPosterWidth) {
              posterHeight = Math.round((height * maxPosterWidth) / width);
              posterWidth = maxPosterWidth;
            }

            const canvas = document.createElement("canvas");
            canvas.width = posterWidth;
            canvas.height = posterHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              cleanup();
              reject(
                new Error(
                  "Could not initialize canvas context for video poster.",
                ),
              );
              return;
            }

            ctx.drawImage(video, 0, 0, posterWidth, posterHeight);

            canvas.toBlob(
              (blob) => {
                cleanup();
                if (!blob) {
                  reject(new Error("Failed to export video poster to JPEG."));
                  return;
                }
                resolve({
                  width,
                  height,
                  durationSeconds,
                  posterBlob: blob,
                });
              },
              "image/jpeg",
              0.82,
            );
          } catch (err) {
            cleanup();
            reject(
              err instanceof Error
                ? err
                : new Error("Failed to generate video poster."),
            );
          }
        };

        video.src = url;
      });
    },
    [],
  );

  // Process a single queue item
  const processItem = useCallback(
    async (item: QueueItem) => {
      updateItem(item.id, {
        status: "extracting",
        progress: 5,
        error: undefined,
      });
      setLiveMessage(`Preparing ${item.file.name}...`);

      try {
        if (item.type === "image") {
          // 1. Image metadata
          const { width, height } = await extractImageMetadata(item.file);

          // 2. Request presigned upload URL
          updateItem(item.id, { status: "uploading", progress: 15 });
          const uploadRes = await requestMediaUpload({
            contentType: item.file.type,
            size: item.file.size,
          });

          if (!uploadRes.success) {
            throw new Error(uploadRes.error);
          }

          const { uploadUrl, key: fileKey } = uploadRes.data;

          // 3. XHR PUT to storage
          const xhrControl = uploadViaXhr({
            url: uploadUrl,
            blob: item.file,
            contentType: item.file.type,
            onProgress: (pct) => {
              // Scale progress between 20% and 90%
              updateItem(item.id, {
                progress: Math.min(90, 20 + Math.round(pct * 0.7)),
              });
            },
          });

          updateItem(item.id, { abortFn: xhrControl.abort });
          await xhrControl.promise;

          // 4. Register in database
          updateItem(item.id, { status: "registering", progress: 95 });
          const createRes = await createMediaItems([
            {
              type: "image",
              fileKey,
              width,
              height,
            },
          ]);

          if (!createRes.success) {
            throw new Error(createRes.error);
          }

          updateItem(item.id, { status: "done", progress: 100 });
          setLiveMessage(`Uploaded ${item.file.name} successfully.`);
          onItemsCreated(createRes.data);
          toast.add({
            title: "Photo uploaded",
            description: `Photo "${item.file.name}" added to media showcase.`,
            type: "success",
          });
        } else {
          // Video processing
          // 1. Video metadata and poster
          const { width, height, durationSeconds, posterBlob } =
            await extractVideoMetadataAndPoster(item.file);

          updateItem(item.id, { status: "uploading", progress: 10 });

          // 2. Request presigned URL for poster
          const posterUploadRes = await requestMediaUpload({
            contentType: "image/jpeg",
            size: posterBlob.size,
          });

          if (!posterUploadRes.success) {
            throw new Error(posterUploadRes.error);
          }

          // 3. Upload poster
          const posterXhr = uploadViaXhr({
            url: posterUploadRes.data.uploadUrl,
            blob: posterBlob,
            contentType: "image/jpeg",
            onProgress: () => {},
          });
          updateItem(item.id, { abortFn: posterXhr.abort });
          await posterXhr.promise;

          // 4. Request presigned URL for video
          const videoUploadRes = await requestMediaUpload({
            contentType: item.file.type,
            size: item.file.size,
          });

          if (!videoUploadRes.success) {
            throw new Error(videoUploadRes.error);
          }

          // 5. Upload video via XHR with progress
          const videoXhr = uploadViaXhr({
            url: videoUploadRes.data.uploadUrl,
            blob: item.file,
            contentType: item.file.type,
            onProgress: (pct) => {
              // Scale between 20% and 90%
              updateItem(item.id, {
                progress: Math.min(90, 20 + Math.round(pct * 0.7)),
              });
            },
          });
          updateItem(item.id, { abortFn: videoXhr.abort });
          await videoXhr.promise;

          // 6. Register in database
          updateItem(item.id, { status: "registering", progress: 95 });
          const createRes = await createMediaItems([
            {
              type: "video",
              fileKey: videoUploadRes.data.key,
              posterKey: posterUploadRes.data.key,
              width,
              height,
              durationSeconds,
            },
          ]);

          if (!createRes.success) {
            throw new Error(createRes.error);
          }

          updateItem(item.id, { status: "done", progress: 100 });
          setLiveMessage(`Uploaded video ${item.file.name} successfully.`);
          onItemsCreated(createRes.data);
          toast.add({
            title: "Video uploaded",
            description: `Video "${item.file.name}" added to media showcase.`,
            type: "success",
          });
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Upload or registration failed.";
        updateItem(item.id, { status: "error", error: errorMsg });
        setLiveMessage(`Error uploading ${item.file.name}: ${errorMsg}`);
        toast.add({
          title: "Upload failed",
          description: `Failed to upload "${item.file.name}": ${errorMsg}`,
          type: "error",
        });
      }
    },
    [
      extractImageMetadata,
      extractVideoMetadataAndPoster,
      uploadViaXhr,
      updateItem,
      onItemsCreated,
    ],
  );

  // Queue orchestrator with concurrency (3 photos, 1 video)
  useEffect(() => {
    const active = queue.filter(
      (i) =>
        i.status === "extracting" ||
        i.status === "uploading" ||
        i.status === "registering",
    );
    const activePhotos = active.filter((i) => i.type === "image").length;
    const activeVideos = active.filter((i) => i.type === "video").length;

    const queued = queue.filter((i) => i.status === "queued");

    for (const item of queued) {
      if (item.type === "image" && activePhotos < 3) {
        processItem(item);
        break;
      }
      if (item.type === "video" && activeVideos < 1 && active.length === 0) {
        // Run video 1 at a time exclusively for optimal bandwidth
        processItem(item);
        break;
      }
    }
  }, [queue, processItem]);

  // Abort active uploads on unmount
  useEffect(() => {
    return () => {
      for (const item of queueRef.current) {
        if (item.abortFn) {
          item.abortFn();
        }
      }
    };
  }, []);

  // Handle incoming files from input or dropzone
  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileList = Array.from(files);
      if (fileList.length === 0) return;

      if (remainingSlots <= 0) {
        toast.add({
          title: "Capacity reached",
          description: `Media storage is at full capacity (${maxCount} items). Delete existing items first.`,
          type: "error",
        });
        return;
      }

      if (fileList.length > remainingSlots) {
        toast.add({
          title: "Too many files",
          description: `You selected ${fileList.length} files, but only ${remainingSlots} slot(s) remain. Please select fewer files.`,
          type: "error",
        });
        return;
      }

      if (fileList.length > MEDIA_MAX_BATCH_SIZE) {
        toast.add({
          title: "Batch limit exceeded",
          description: `You can upload up to ${MEDIA_MAX_BATCH_SIZE} files at once.`,
          type: "error",
        });
        return;
      }

      const newQueueItems: QueueItem[] = [];

      for (const file of fileList) {
        const validation = validateMediaFile(file);
        if (!validation.valid) {
          toast.add({
            title: "Invalid file",
            description: `"${file.name}": ${validation.error}`,
            type: "error",
          });
          continue;
        }

        newQueueItems.push({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
          file,
          type: validation.type,
          status: "queued",
          progress: 0,
        });
      }

      if (newQueueItems.length > 0) {
        setQueue((prev) => [...prev, ...newQueueItems]);
        setLiveMessage(
          `Added ${newQueueItems.length} file(s) to upload queue.`,
        );
      }
    },
    [remainingSlots, maxCount],
  );

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer?.types?.includes("Files")) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    if (e.dataTransfer?.types?.includes("Files")) {
      e.preventDefault();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const cancelItem = (id: string) => {
    const item = queue.find((i) => i.id === id);
    if (item?.abortFn) {
      item.abortFn();
    }
    setQueue((prev) => prev.filter((i) => i.id !== id));
  };

  const retryItem = (id: string) => {
    updateItem(id, { status: "queued", progress: 0, error: undefined });
  };

  const clearCompleted = () => {
    setQueue((prev) => prev.filter((i) => i.status !== "done"));
  };

  const hasDone = queue.some((i) => i.status === "done");

  return (
    <div className="space-y-4">
      {/* Polite live region for screen readers */}
      <div className="sr-only" aria-live="polite">
        {liveMessage}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(e.target.files);
            e.target.value = "";
          }
        }}
      />

      {/* Styled Dropzone */}
      <button
        type="button"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer select-none ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border/80 bg-card hover:border-primary/60 hover:bg-muted/30"
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
        aria-label="Upload photos and videos drop zone. Click or drag and drop files."
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <IconUpload className="size-6" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            Click to upload or drag and drop photos and videos
          </p>
          <p className="text-xs text-muted-foreground max-w-md">
            Photos: JPEG, PNG, WebP up to 10 MB. Videos: MP4, WebM up to 100 MB.
            Recommended: MP4 (H.264) for video compatibility.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-tint px-3 py-1 text-xs font-medium text-foreground">
          <span>Capacity:</span>
          <span className="font-semibold">
            {currentCount} of {maxCount}
          </span>
          <span>slots used</span>
        </div>
      </button>

      {/* Upload Queue Section */}
      {queue.length > 0 ? (
        <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              Upload Queue ({queue.length})
            </span>
            {hasDone ? (
              <Button
                variant="ghost"
                size="xs"
                onClick={clearCompleted}
                className="h-7 text-xs"
              >
                Clear completed
              </Button>
            ) : null}
          </div>

          <div className="divide-y divide-border/60">
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 py-3 first:pt-1 last:pb-1"
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    {item.type === "video" ? (
                      <IconMovie
                        className="size-4 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                    ) : (
                      <IconPhoto
                        className="size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                    )}
                    <span className="font-medium text-foreground truncate">
                      {item.file.name}
                    </span>
                    <span className="text-muted-foreground shrink-0 text-[11px]">
                      ({formatFileSize(item.file.size)})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === "done" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        <IconCheck className="size-3.5" aria-hidden="true" />
                        <span>Uploaded</span>
                      </span>
                    ) : item.status === "error" ? (
                      <div className="flex items-center gap-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-destructive">
                          <IconAlertCircle
                            className="size-3.5"
                            aria-hidden="true"
                          />
                          <span>Failed</span>
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => retryItem(item.id)}
                          aria-label={`Retry uploading ${item.file.name}`}
                          className="size-7"
                        >
                          <IconRefresh className="size-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground capitalize">
                        {item.status === "extracting"
                          ? "Preparing frame..."
                          : item.status === "registering"
                            ? "Saving..."
                            : `${item.progress}%`}
                      </span>
                    )}

                    {item.status !== "done" ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => cancelItem(item.id)}
                        aria-label={`Cancel upload of ${item.file.name}`}
                        className="size-7 text-muted-foreground hover:text-foreground"
                      >
                        <IconX className="size-3.5" />
                      </Button>
                    ) : null}
                  </div>
                </div>

                {/* Progress bar */}
                {item.status !== "done" && item.status !== "error" ? (
                  <div className="w-full">
                    <label htmlFor={`progress-${item.id}`} className="sr-only">
                      Upload progress for {item.file.name}
                    </label>
                    <progress
                      id={`progress-${item.id}`}
                      value={item.progress}
                      max={100}
                      className="h-1.5 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
                    />
                  </div>
                ) : null}

                {/* Error message */}
                {item.status === "error" && item.error ? (
                  <p className="text-[11px] text-destructive">{item.error}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
