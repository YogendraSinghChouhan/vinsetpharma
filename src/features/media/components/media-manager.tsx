"use client";

import { useEffect, useState } from "react";
import { MEDIA_MAX_ITEMS } from "../constants";
import type { Media } from "../schema";
import { MediaSortableGrid } from "./media-sortable-grid";
import { MediaUploadArea } from "./media-upload-area";

interface MediaManagerProps {
  initialItems: Media[];
}

export function MediaManager({ initialItems }: MediaManagerProps) {
  const [items, setItems] = useState<Media[]>(initialItems);

  // Synchronize state if server revalidates or parent updates
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleItemsCreated = (newItems: Media[]) => {
    setItems((prev) => [...prev, ...newItems]);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone & Queue */}
      <MediaUploadArea
        currentCount={items.length}
        maxCount={MEDIA_MAX_ITEMS}
        onItemsCreated={handleItemsCreated}
      />

      {/* Sortable Grid */}
      <MediaSortableGrid items={items} onItemsChange={setItems} />
    </div>
  );
}
