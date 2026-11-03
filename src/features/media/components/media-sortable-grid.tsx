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
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconGripVertical,
  IconMovie,
  IconPencil,
  IconPhoto,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { getImageUrl } from "@/features/storage/image-url";
import { cn } from "@/lib/utils";
import { deleteMedia, reorderMedia, updateMediaCaption } from "../actions";
import type { Media } from "../schema";
import { formatDuration } from "../utils";

interface MediaSortableGridProps {
  items: Media[];
  onItemsChange: (items: Media[]) => void;
}

interface MediaTileProps {
  item: Media;
  onCaptionUpdate: (id: string, caption: string | null) => void;
  onDelete: (id: string) => void;
}

function MediaTile({ item, onCaptionUpdate, onDelete }: MediaTileProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const [isEditing, setIsEditing] = useState(false);
  const [captionInput, setCaptionInput] = useState(item.caption ?? "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingCaption, startCaptionTransition] = useTransition();
  const [isDeletingItem, startDeleteTransition] = useTransition();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const imageUrl =
    item.type === "video"
      ? getImageUrl(item.posterKey || item.fileKey)
      : getImageUrl(item.fileKey);

  const handleSaveCaption = () => {
    startCaptionTransition(async () => {
      const res = await updateMediaCaption({
        id: item.id,
        caption: captionInput.trim() || null,
      });

      if (!res.success) {
        toast.add({
          title: "Update failed",
          description: res.error,
          type: "error",
        });
        return;
      }

      onCaptionUpdate(item.id, res.data.caption);
      setIsEditing(false);
      toast.add({
        title: "Caption saved",
        description: "Caption updated successfully.",
        type: "success",
      });
    });
  };

  const handleConfirmDelete = () => {
    startDeleteTransition(async () => {
      const res = await deleteMedia(item.id);
      if (!res.success) {
        toast.add({
          title: "Delete failed",
          description: res.error,
          type: "error",
        });
        return;
      }

      onDelete(item.id);
      setIsDeleting(false);
      toast.add({
        title: "Item deleted",
        description: `${item.type === "video" ? "Video" : "Photo"} deleted successfully.`,
        type: "success",
      });
    });
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xs transition-shadow",
          isDragging && "opacity-50 ring-2 ring-primary shadow-md z-20",
        )}
      >
        {/* Uniform Thumbnail Window */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={item.caption || `${item.type} media`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300"
          />

          {/* Type Badge Overlay */}
          <div className="absolute top-2 left-2 pointer-events-none">
            <Badge
              variant="secondary"
              className="gap-1 bg-background/90 backdrop-blur-xs text-[11px] font-medium shadow-2xs text-foreground"
            >
              {item.type === "video" ? (
                <>
                  <IconMovie
                    className="size-3 text-accent"
                    aria-hidden="true"
                  />
                  <span>Video · {formatDuration(item.durationSeconds)}</span>
                </>
              ) : (
                <>
                  <IconPhoto
                    className="size-3 text-primary"
                    aria-hidden="true"
                  />
                  <span>Photo</span>
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Caption Display (if any) */}
        {item.caption ? (
          <div className="px-3 pt-2">
            <p
              className="text-xs text-foreground font-medium truncate"
              title={item.caption}
            >
              {item.caption}
            </p>
          </div>
        ) : null}

        {/* Action Controls Bar (no hover-only controls, 44px touch targets) */}
        <div className="flex items-center justify-between p-1.5 mt-auto border-t border-border/50 bg-surface-tint/50">
          {/* Accessible Drag Handle */}
          <button
            type="button"
            aria-label={`Drag to reorder ${item.caption || item.type}`}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-grab active:cursor-grabbing"
            {...listeners}
            {...attributes}
          >
            <IconGripVertical className="size-4" aria-hidden="true" />
          </button>

          <div className="flex items-center">
            {/* Edit Caption Action */}
            <button
              type="button"
              aria-label={`Edit caption for ${item.caption || item.type}`}
              onClick={() => {
                setCaptionInput(item.caption ?? "");
                setIsEditing(true);
              }}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <IconPencil className="size-4" aria-hidden="true" />
            </button>

            {/* Delete Action */}
            <button
              type="button"
              aria-label={`Delete ${item.caption || item.type}`}
              onClick={() => setIsDeleting(true)}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
            >
              <IconTrash className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Caption Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Caption</DialogTitle>
            <DialogDescription>
              Provide an optional caption to accompany this {item.type}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-2">
            <Field>
              <FieldLabel htmlFor={`caption-input-${item.id}`}>
                Caption
              </FieldLabel>
              <Input
                id={`caption-input-${item.id}`}
                value={captionInput}
                maxLength={120}
                onChange={(e) => setCaptionInput(e.target.value)}
                placeholder="Short caption"
                autoFocus
              />
              <div className="flex justify-end text-[11px] text-muted-foreground">
                {captionInput.length} / 120
              </div>
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={isSavingCaption}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveCaption}
              disabled={isSavingCaption}
            >
              {isSavingCaption ? "Saving..." : "Save Caption"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {item.type === "video" ? "Video" : "Photo"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this media item? This will
              permanently remove the file and poster from storage and cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingItem}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeletingItem}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingItem ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function MediaSortableGrid({
  items,
  onItemsChange,
}: MediaSortableGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const announcements: Announcements = {
    onDragStart({ active }) {
      const item = items.find((i) => i.id === active.id);
      const index = items.findIndex((i) => i.id === active.id) + 1;
      return `Picked up ${item?.type || "item"} "${item?.caption || ""}". Position ${index} of ${items.length}. Use arrow keys to reorder, spacebar to drop.`;
    },
    onDragOver({ over }) {
      if (!over) return undefined;
      const overItem = items.find((i) => i.id === over.id);
      const newPos = items.findIndex((i) => i.id === over.id) + 1;
      return `Item is over "${overItem?.caption || overItem?.type}", position ${newPos} of ${items.length}.`;
    },
    onDragEnd({ active, over }) {
      if (!over || active.id === over.id) {
        return "Item dropped with no position change.";
      }
      const newPos = items.findIndex((i) => i.id === over.id) + 1;
      return `Item dropped at position ${newPos} of ${items.length}.`;
    },
    onDragCancel() {
      return "Reordering cancelled.";
    },
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const previousItems = items;
    const reordered = arrayMove(items, oldIndex, newIndex);
    onItemsChange(reordered);

    const res = await reorderMedia({
      ids: reordered.map((i) => i.id),
    });

    if (!res.success) {
      onItemsChange(previousItems);
      toast.add({
        title: "Reorder failed",
        description: res.error,
        type: "error",
      });
    } else {
      toast.add({
        title: "Order saved",
        description: "Media showcase order has been updated.",
        type: "success",
      });
    }
  };

  const handleCaptionUpdate = (id: string, newCaption: string | null) => {
    onItemsChange(
      items.map((item) =>
        item.id === id ? { ...item, caption: newCaption } : item,
      ),
    );
  };

  const handleDeleteItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  if (items.length === 0) {
    return (
      <Empty className="py-12 border border-dashed border-border rounded-2xl bg-card">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconPhoto
              className="size-6 text-muted-foreground"
              aria-hidden="true"
            />
          </EmptyMedia>
          <EmptyTitle>No photos or videos yet</EmptyTitle>
          <EmptyDescription>
            No photos or videos yet. Upload your first files above.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium">
          Drag to arrange. The public Media page shows items in this order.
        </p>
        <span className="text-xs font-semibold text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        accessibility={{ announcements }}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {items.map((item) => (
              <MediaTile
                key={item.id}
                item={item}
                onCaptionUpdate={handleCaptionUpdate}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
