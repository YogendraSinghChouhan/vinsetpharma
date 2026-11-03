"use client";

import {
  type Announcements,
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconDeviceMobile,
  IconDeviceTv,
  IconGripVertical,
  IconLoader2,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { getImageUrl } from "@/features/storage/image-url";
import { cn } from "@/lib/utils";
import {
  deleteHeroSlide,
  reorderHeroSlides,
  updateHeroSlide,
} from "../actions";
import {
  HERO_ALT_MAX_LENGTH,
  HERO_FOCUS_VALUES,
  type HeroSlideFocus,
} from "../constants";
import type { HeroSlide } from "../schema";
import { getFocusPosition } from "../utils";

interface HeroSortableListProps {
  items: HeroSlide[];
  onItemsChange: (items: HeroSlide[]) => void;
}

interface HeroSlideCardProps {
  item: HeroSlide;
  index: number;
  total: number;
  onUpdate: (updated: HeroSlide) => void;
  onDelete: (id: string) => void;
}

function HeroSlideCard({
  item,
  index,
  total,
  onUpdate,
  onDelete,
}: HeroSlideCardProps) {
  const [alt, setAlt] = useState(item.alt ?? "");
  const [focus, setFocus] = useState<HeroSlideFocus>(item.focus);
  const [isSaving, startSaveTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.75 : 1,
  };

  const isDirty = alt !== (item.alt ?? "") || focus !== item.focus;
  const imageUrl = getImageUrl(item.imageKey);

  const handleSave = () => {
    startSaveTransition(async () => {
      const trimmedAlt = alt.trim();
      const res = await updateHeroSlide({
        id: item.id,
        alt: trimmedAlt.length > 0 ? trimmedAlt : null,
        focus,
      });

      if (res.success) {
        onUpdate(res.data);
        toast.add({
          title: "Slide saved",
          description: `Changes to Image ${index + 1} saved successfully.`,
          type: "success",
        });
      } else {
        toast.add({
          title: "Save failed",
          description: res.error,
          type: "error",
        });
      }
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const res = await deleteHeroSlide(item.id);
      if (res.success) {
        onDelete(item.id);
        setShowDeleteDialog(false);
        toast.add({
          title: "Slide deleted",
          description: `Image ${index + 1} removed from hero banner.`,
          type: "success",
        });
      } else {
        toast.add({
          title: "Delete failed",
          description: res.error,
          type: "error",
        });
      }
    });
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xs transition-shadow duration-200",
          isDragging && "ring-2 ring-primary shadow-lg",
        )}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <button
              type="button"
              {...attributes}
              {...listeners}
              aria-label={`Drag to reorder slide ${index + 1}`}
              className="flex size-10 shrink-0 cursor-grab items-center justify-center rounded-xl border border-border/70 bg-muted/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <IconGripVertical className="size-5" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="font-semibold text-xs px-2.5 py-0.5"
              >
                Image {index + 1} of {total}
              </Badge>
              {isDirty && (
                <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  (Unsaved changes)
                </span>
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive min-h-[44px] px-3"
            onClick={() => setShowDeleteDialog(true)}
            aria-label={`Delete slide ${index + 1}`}
          >
            <IconTrash className="size-4 mr-1.5" />
            Delete
          </Button>
        </div>

        {/* Card Body: Previews & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Dual Previews: 16:9 Desktop + Phone-shaped Mobile */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Preview (Desktop & Mobile)</span>
              <span className="font-mono text-[11px]">
                {item.width} &times; {item.height}px
              </span>
            </div>

            <div className="flex gap-3 sm:gap-4 items-stretch">
              {/* Desktop 16:9 preview */}
              <div className="relative flex-1 aspect-video overflow-hidden rounded-xl border border-border/80 bg-muted/30 shadow-2xs">
                <Image
                  src={imageUrl}
                  alt={alt || `Hero slide ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 35vw, 60vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: getFocusPosition(focus),
                  }}
                  className="transition-[object-position] duration-200"
                />
                <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                  <IconDeviceTv className="size-3" />
                  <span>Desktop 16:9</span>
                </div>
              </div>

              {/* Mobile phone-shaped 9:16 preview */}
              <div className="relative w-20 sm:w-24 shrink-0 aspect-[9/16] overflow-hidden rounded-xl border-2 border-border/90 bg-muted/30 shadow-xs">
                <Image
                  src={imageUrl}
                  alt={alt || `Mobile crop ${index + 1}`}
                  fill
                  sizes="100px"
                  style={{
                    objectFit: "cover",
                    objectPosition: getFocusPosition(focus),
                  }}
                  className="transition-[object-position] duration-200"
                />
                <div className="pointer-events-none absolute bottom-1.5 inset-x-1.5 flex justify-center items-center gap-0.5 rounded bg-black/75 py-0.5 text-[9px] font-medium text-white backdrop-blur-xs">
                  <IconDeviceMobile className="size-2.5" />
                  <span>Mobile</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Controls: Focus & Alt */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              {/* Focus Control (Three-option radio group) */}
              <div className="space-y-1.5">
                <span
                  id={`focus-label-${item.id}`}
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block"
                >
                  Focus crop alignment
                </span>
                <div
                  role="radiogroup"
                  aria-labelledby={`focus-label-${item.id}`}
                  className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-muted/50 border border-border/60"
                >
                  {HERO_FOCUS_VALUES.map((pos) => {
                    const isSelected = focus === pos;
                    return (
                      <label
                        key={pos}
                        className={cn(
                          "flex min-h-[44px] items-center justify-center cursor-pointer rounded-lg text-xs font-semibold capitalize transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                          isSelected
                            ? "bg-card text-foreground shadow-xs border border-border/80"
                            : "text-muted-foreground hover:text-foreground hover:bg-card/40",
                        )}
                      >
                        <input
                          type="radio"
                          name={`focus-${item.id}`}
                          value={pos}
                          checked={isSelected}
                          onChange={() => setFocus(pos)}
                          className="sr-only"
                        />
                        {pos}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Image description for screen readers */}
              <Field className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor={`alt-${item.id}`}
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Image description (optional)
                  </FieldLabel>
                  <span
                    className={cn(
                      "text-xs font-mono",
                      alt.length > HERO_ALT_MAX_LENGTH
                        ? "text-destructive font-semibold"
                        : "text-muted-foreground",
                    )}
                    aria-live="polite"
                  >
                    {alt.length} / {HERO_ALT_MAX_LENGTH}
                  </span>
                </div>
                <Input
                  id={`alt-${item.id}`}
                  value={alt}
                  maxLength={HERO_ALT_MAX_LENGTH}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Describe image subject for screen readers"
                  className="text-xs sm:text-sm min-h-[44px]"
                />
              </Field>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="default"
                size="sm"
                disabled={
                  !isDirty || isSaving || alt.length > HERO_ALT_MAX_LENGTH
                }
                onClick={handleSave}
                className="min-h-[44px] min-w-[120px] font-medium"
              >
                {isSaving ? (
                  <>
                    <IconLoader2 className="size-4 animate-spin mr-1.5" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete hero slide</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove Image {index + 1} from the hero
              banner? This action will permanently remove it from the slideshow
              and delete the image file from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete slide"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function HeroSortableList({
  items,
  onItemsChange,
}: HeroSortableListProps) {
  const [, startReorderTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const announcements: Announcements = {
    onDragStart({ active }) {
      const idx = items.findIndex((i) => i.id === active.id);
      return `Picked up hero slide ${idx + 1} of ${items.length}.`;
    },
    onDragOver({ active, over }) {
      if (over) {
        const from = items.findIndex((i) => i.id === active.id);
        const to = items.findIndex((i) => i.id === over.id);
        return `Hero slide moved from position ${from + 1} to position ${to + 1}.`;
      }
    },
    onDragEnd({ over }) {
      if (over) {
        const to = items.findIndex((i) => i.id === over.id);
        return `Hero slide dropped at position ${to + 1} of ${items.length}.`;
      }
      return "Hero slide drag cancelled.";
    },
    onDragCancel() {
      return "Hero slide drag cancelled.";
    },
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const previousItems = [...items];
    const newItems = arrayMove(items, oldIndex, newIndex);
    onItemsChange(newItems);

    startReorderTransition(async () => {
      const newIds = newItems.map((i) => i.id);
      const res = await reorderHeroSlides({ ids: newIds });
      if (!res.success) {
        onItemsChange(previousItems);
        toast.add({
          title: "Reorder failed",
          description: res.error,
          type: "error",
        });
      } else {
        toast.add({
          title: "Slides reordered",
          description: "Hero banner order updated successfully.",
          type: "success",
        });
      }
    });
  };

  const handleUpdate = (updated: HeroSlide) => {
    onItemsChange(items.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleDelete = (id: string) => {
    onItemsChange(items.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Helper Line & Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-1">
        <h3 className="text-base font-semibold text-foreground">
          Active Slides
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Images appear on the home page in this order.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        accessibility={{ announcements }}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {items.map((item, index) => (
              <HeroSlideCard
                key={item.id}
                item={item}
                index={index}
                total={items.length}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
