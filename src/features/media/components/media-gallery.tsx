"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export type MediaGalleryItem = {
  id: string;
  type: "image" | "video";
  fileUrl: string;
  posterUrl?: string;
  width: number;
  height: number;
  caption: string | null;
};

type MediaGalleryProps = {
  items: MediaGalleryItem[];
};

export function MediaGallery({ items }: MediaGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<MediaGalleryItem | null>(
    null,
  );

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure
            key={item.id}
            className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs"
          >
            {item.type === "video" ? (
              <video
                className="aspect-4/3 w-full bg-muted object-cover"
                controls
                preload="metadata"
                poster={item.posterUrl}
              >
                <source src={item.fileUrl} />
                <track kind="captions" />
                Your browser does not support video playback.
              </video>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedImage(item)}
                className="group block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                aria-label={`Open ${item.caption || "image"} in full size`}
              >
                <Image
                  src={item.fileUrl}
                  alt={item.caption || "Vinset pharmaceuticals media"}
                  width={item.width}
                  height={item.height}
                  className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            )}
            {item.caption ? (
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                {item.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      <Dialog
        open={selectedImage !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImage(null);
          }
        }}
      >
        <DialogContent className="max-w-7xl border-0 bg-black/95 p-2 sm:p-4">
          {selectedImage ? (
            <>
              <DialogTitle className="sr-only">
                {selectedImage.caption || "Full-size media image"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Full-size view of the selected media image.
              </DialogDescription>
              <Image
                src={selectedImage.fileUrl}
                alt={selectedImage.caption || "Vinset pharmaceuticals media"}
                width={selectedImage.width}
                height={selectedImage.height}
                className="max-h-[88vh] w-full object-contain"
              />
              {selectedImage.caption ? (
                <p className="px-2 pb-1 text-center text-sm text-white/85">
                  {selectedImage.caption}
                </p>
              ) : null}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
