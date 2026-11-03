"use client";

import {
  IconAlertCircle,
  IconCheck,
  IconPhoto,
  IconRefresh,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { createHeroSlides, requestHeroUpload } from "../actions";
import {
  HERO_MAX_SLIDES,
  HERO_MIN_ASPECT,
  HERO_MIN_WIDTH,
  HERO_RECOMMENDED_WIDTH,
} from "../constants";
import type { HeroSlide } from "../schema";
import { formatFileSize, validateHeroFileTypeAndSize } from "../utils";

interface QueueItem {
  id: string;
  file: File;
  status:
    | "queued"
    | "extracting"
    | "uploading"
    | "registering"
    | "done"
    | "error";
  progress: number;
  error?: string;
  warning?: string;
  abortFn?: () => void;
  metadata?: {
    width: number;
    height: number;
  };
}

interface HeroUploadAreaProps {
  currentCount: number;
  maxCount?: number;
  onSlidesCreated: (slides: HeroSlide[]) => void;
}

export function HeroUploadArea({
  currentCount,
  maxCount = HERO_MAX_SLIDES,
  onSlidesCreated,
}: HeroUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [liveMessage, setLiveMessage] = useState("");

  const queueRef = useRef<QueueItem[]>(queue);
  queueRef.current = queue;

  const remainingSlots = Math.max(0, maxCount - currentCount);

  const updateItem = useCallback((id: string, patch: Partial<QueueItem>) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

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

  const processItem = useCallback(
    async (item: QueueItem) => {
      updateItem(item.id, {
        status: "extracting",
        progress: 10,
        error: undefined,
      });
      setLiveMessage(`Analyzing ${item.file.name}...`);

      try {
        // 1. Natural dimension analysis
        const { width, height } = await extractImageMetadata(item.file);
        const aspect = width / height;

        // Strict rejection rules
        if (width < HERO_MIN_WIDTH) {
          throw new Error(
            `Image width (${width}px) is too small. Minimum required width is ${HERO_MIN_WIDTH}px.`,
          );
        }

        if (aspect < HERO_MIN_ASPECT) {
          throw new Error(
            `Image aspect ratio (${aspect.toFixed(2)}) is too square or portrait. Minimum landscape aspect ratio is ${HERO_MIN_ASPECT}:1.`,
          );
        }

        // Gentle recommendation note
        let warningNote: string | undefined;
        if (width < HERO_RECOMMENDED_WIDTH) {
          warningNote = `Photo is ${width}px wide (recommended ${HERO_RECOMMENDED_WIDTH}px+ for crisp full-width displays).`;
        }

        updateItem(item.id, {
          metadata: { width, height },
          warning: warningNote,
          status: "uploading",
          progress: 25,
        });

        // 2. Request presigned upload URL
        const uploadRes = await requestHeroUpload({
          contentType: item.file.type,
          size: item.file.size,
        });

        if (!uploadRes.success) {
          throw new Error(uploadRes.error);
        }

        const { uploadUrl, key: fileKey } = uploadRes.data;

        // 3. XHR PUT to storage with signed Content-Type
        const xhrControl = uploadViaXhr({
          url: uploadUrl,
          blob: item.file,
          contentType: item.file.type,
          onProgress: (pct) => {
            // Scale between 30% and 90%
            updateItem(item.id, {
              progress: Math.min(90, 30 + Math.round(pct * 0.6)),
            });
          },
        });

        updateItem(item.id, { abortFn: xhrControl.abort });
        await xhrControl.promise;

        // 4. Register slide in database
        updateItem(item.id, { status: "registering", progress: 95 });
        const createRes = await createHeroSlides([
          {
            imageKey: fileKey,
            width,
            height,
            focus: "center",
          },
        ]);

        if (!createRes.success) {
          throw new Error(createRes.error);
        }

        updateItem(item.id, { status: "done", progress: 100 });
        setLiveMessage(`Uploaded ${item.file.name} successfully.`);
        onSlidesCreated(createRes.data);
        toast.add({
          title: "Slide added",
          description: `Photo "${item.file.name}" added to hero banner.`,
          type: "success",
        });
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
    [extractImageMetadata, uploadViaXhr, updateItem, onSlidesCreated],
  );

  // Queue orchestrator with concurrency 2
  useEffect(() => {
    const active = queue.filter(
      (i) =>
        i.status === "extracting" ||
        i.status === "uploading" ||
        i.status === "registering",
    ).length;

    const queued = queue.filter((i) => i.status === "queued");

    if (active < 2 && queued.length > 0) {
      const nextBatch = queued.slice(0, 2 - active);
      for (const item of nextBatch) {
        processItem(item);
      }
    }
  }, [queue, processItem]);

  const addFilesToQueue = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (remainingSlots <= 0) {
      toast.add({
        title: "Capacity reached",
        description: `Maximum capacity of ${maxCount} hero slides reached. Remove an existing slide first.`,
        type: "error",
      });
      return;
    }

    const filesToAccept = fileArray.slice(0, remainingSlots);
    if (fileArray.length > remainingSlots) {
      toast.add({
        title: "Slot limit",
        description: `Only ${remainingSlots} slot(s) available. Queued the first ${remainingSlots} photo(s).`,
        type: "warning",
      });
    }

    const newQueueItems: QueueItem[] = [];

    for (const file of filesToAccept) {
      const validation = validateHeroFileTypeAndSize(file);
      if (!validation.valid) {
        toast.add({
          title: "Invalid file",
          description: `"${file.name}": ${validation.error}`,
          type: "error",
        });
        continue;
      }

      newQueueItems.push({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        status: "queued",
        progress: 0,
      });
    }

    if (newQueueItems.length > 0) {
      setQueue((prev) => [...prev, ...newQueueItems]);
      setLiveMessage(`Added ${newQueueItems.length} photo(s) to upload queue.`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer?.files) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const handleCancelItem = (id: string) => {
    const item = queueRef.current.find((i) => i.id === id);
    if (item?.abortFn) {
      item.abortFn();
    }
    setQueue((prev) => prev.filter((i) => i.id !== id));
    toast.add({
      title: "Cancelled",
      description: "Upload cancelled.",
      type: "info",
    });
  };

  const handleRetryItem = (item: QueueItem) => {
    updateItem(item.id, {
      status: "queued",
      progress: 0,
      error: undefined,
    });
  };

  const handleDismissItem = (id: string) => {
    setQueue((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-2xs space-y-6">
      {/* Header & Slot Usage Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border/60">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Hero banner images
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Wide landscape photos displayed in the home page slideshow.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Slots:
          </span>
          <Badge
            variant={currentCount >= maxCount ? "destructive" : "secondary"}
            className="font-mono text-xs font-semibold px-2.5 py-0.5"
          >
            {currentCount} of {maxCount}
          </Badge>
        </div>
      </div>

      {/* Clear Guidance Card */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs sm:text-sm text-foreground/90 leading-relaxed space-y-1">
        <p className="font-semibold text-primary">Photo guidelines:</p>
        <p className="text-muted-foreground">
          Use wide photos, at least 1920 &times; 1080, JPG or WebP, ideally
          under 1 MB each. Keep the main subject near the centre and avoid text
          inside the photo: the page heading is shown on top. Only upload photos
          you have the right to use.
        </p>
      </div>

      {/* Drag & Drop Area */}
      <button
        type="button"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={remainingSlots <= 0}
        onClick={() => {
          if (remainingSlots > 0) fileInputRef.current?.click();
        }}
        className={`relative flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-colors duration-200 ${
          isDragOver
            ? "border-primary bg-primary/10"
            : "border-border/80 hover:border-primary/50 bg-muted/20"
        } ${remainingSlots <= 0 ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
        aria-label="Upload wide photos drop zone. Click or drag and drop files."
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={remainingSlots <= 0}
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) {
              addFilesToQueue(e.target.files);
              e.target.value = "";
            }
          }}
        />

        <div className="flex size-12 items-center justify-center rounded-2xl bg-card border border-border/80 text-primary shadow-2xs">
          <IconUpload className="size-6" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {remainingSlots > 0
              ? "Drag and drop wide photos here, or click to browse"
              : "Hero slide capacity reached (6/6 slots full)"}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports JPG, PNG, and WebP up to 10 MB each (min 1280px wide,
            landscape aspect &ge; 1.2:1)
          </p>
        </div>

        {remainingSlots > 0 && (
          <span className="mt-1 inline-flex min-h-[44px] items-center justify-center px-6 rounded-full font-medium text-xs border border-border bg-card shadow-2xs hover:bg-muted/70 transition-colors">
            Select photos
          </span>
        )}
      </button>

      {/* Polite Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        {liveMessage}
      </div>

      {/* Upload Queue Progress List */}
      {queue.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Upload Queue
          </h3>
          <ul className="space-y-2">
            {queue.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 rounded-xl border border-border/70 bg-card p-3 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <IconPhoto className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium text-foreground">
                      {item.file.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      ({formatFileSize(item.file.size)})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.status === "uploading" && (
                      <span className="text-xs font-mono text-muted-foreground">
                        {item.progress}%
                      </span>
                    )}
                    {item.status === "done" && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <IconCheck className="size-4" /> Uploaded
                      </span>
                    )}
                    {item.status === "error" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 min-h-[36px] px-2 text-xs text-primary"
                        onClick={() => handleRetryItem(item)}
                      >
                        <IconRefresh className="size-3.5 mr-1" /> Retry
                      </Button>
                    )}
                    {(item.status === "uploading" ||
                      item.status === "queued") && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 min-h-[36px] min-w-[36px] text-muted-foreground hover:text-destructive"
                        aria-label={`Cancel upload for ${item.file.name}`}
                        onClick={() => handleCancelItem(item.id)}
                      >
                        <IconX className="size-4" />
                      </Button>
                    )}
                    {(item.status === "done" || item.status === "error") && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 min-h-[36px] min-w-[36px] text-muted-foreground"
                        aria-label={`Dismiss ${item.file.name}`}
                        onClick={() => handleDismissItem(item.id)}
                      >
                        <IconX className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Native Progress Element */}
                {(item.status === "uploading" ||
                  item.status === "registering") && (
                  <div className="space-y-1">
                    <progress
                      value={item.progress}
                      max={100}
                      className="h-1.5 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      {item.status === "registering"
                        ? "Registering slide in database..."
                        : "Uploading to secure storage..."}
                    </p>
                  </div>
                )}

                {/* Error message */}
                {item.status === "error" && item.error && (
                  <div className="flex items-start gap-1.5 rounded-lg bg-destructive/10 p-2 text-xs text-destructive">
                    <IconAlertCircle className="size-4 shrink-0 mt-0.5" />
                    <p>{item.error}</p>
                  </div>
                )}

                {/* Warning / gentle recommendation note */}
                {item.warning && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400">
                    {item.warning}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
