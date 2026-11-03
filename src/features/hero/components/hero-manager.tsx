"use client";

import { useEffect, useState } from "react";
import { HERO_MAX_SLIDES } from "../constants";
import type { HeroSlide } from "../schema";
import { HeroEmptyState } from "./hero-empty-state";
import { HeroSortableList } from "./hero-sortable-list";
import { HeroUploadArea } from "./hero-upload-area";

interface HeroManagerProps {
  initialItems: HeroSlide[];
}

export function HeroManager({ initialItems }: HeroManagerProps) {
  const [items, setItems] = useState<HeroSlide[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleSlidesCreated = (newSlides: HeroSlide[]) => {
    setItems((prev) => [...prev, ...newSlides]);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone & Guidance */}
      <HeroUploadArea
        currentCount={items.length}
        maxCount={HERO_MAX_SLIDES}
        onSlidesCreated={handleSlidesCreated}
      />

      {/* Sortable List or Empty State */}
      {items.length > 0 ? (
        <HeroSortableList items={items} onItemsChange={setItems} />
      ) : (
        <HeroEmptyState />
      )}
    </div>
  );
}
