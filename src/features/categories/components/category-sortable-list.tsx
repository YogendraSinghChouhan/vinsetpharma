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
  IconCategory,
  IconGripVertical,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { ROUTES } from "@/config/site";
import { getImageUrl } from "@/features/storage/image-url";
import { cn } from "@/lib/utils";
import { deleteCategory, reorderCategories } from "../actions";
import type { CategoryWithProductCount } from "../data";

interface CategorySortableListProps {
  initialCategories: CategoryWithProductCount[];
}

export function CategorySortableList({
  initialCategories,
}: CategorySortableListProps) {
  const router = useRouter();
  const [categories, setCategories] =
    useState<CategoryWithProductCount[]>(initialCategories);
  const [isPending, startTransition] = useTransition();

  // Keep local state in sync when server data updates
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

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
      const item = categories.find((c) => c.id === active.id);
      const index = categories.findIndex((c) => c.id === active.id) + 1;
      return `Picked up category "${item?.name ?? ""}". Position ${index} of ${categories.length}. Use arrow keys to reorder, spacebar to drop.`;
    },
    onDragOver({ over }) {
      if (!over) return undefined;
      const overItem = categories.find((c) => c.id === over.id);
      const newPos = categories.findIndex((c) => c.id === over.id) + 1;
      return `Category is over "${overItem?.name ?? ""}", position ${newPos} of ${categories.length}.`;
    },
    onDragEnd({ active, over }) {
      if (!over || active.id === over.id) {
        return "Category dropped with no position change.";
      }
      const newPos = categories.findIndex((c) => c.id === over.id) + 1;
      return `Category dropped at position ${newPos} of ${categories.length}.`;
    },
    onDragCancel() {
      return "Reordering cancelled.";
    },
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const previousCategories = categories;
    const reordered = arrayMove(categories, oldIndex, newIndex);
    setCategories(reordered);

    startTransition(async () => {
      const res = await reorderCategories({
        ids: reordered.map((c) => c.id),
      });

      if (!res.success) {
        setCategories(previousCategories);
        toast.add({
          title: "Reorder failed",
          description: res.error,
          type: "error",
        });
      } else {
        toast.add({
          title: "Order updated",
          description: "Category list order has been saved.",
          type: "success",
        });
        router.refresh();
      }
    });
  }

  async function handleDeleteCategory(category: CategoryWithProductCount) {
    const previousCategories = categories;
    setCategories((prev) => prev.filter((c) => c.id !== category.id));

    startTransition(async () => {
      const res = await deleteCategory(category.id);

      if (!res.success) {
        setCategories(previousCategories);
        toast.add({
          title: "Delete failed",
          description: res.error,
          type: "error",
        });
      } else {
        toast.add({
          title: "Category deleted",
          description: `"${category.name}" has been permanently removed.`,
          type: "success",
        });
        router.refresh();
      }
    });
  }

  if (categories.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center border border-dashed border-border bg-card p-12 text-center">
        <div className="flex size-12 items-center justify-center border border-border bg-muted text-muted-foreground mb-4">
          <IconCategory className="size-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-foreground">
          No categories yet
        </h3>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground mb-6">
          Your product catalog has no categories defined. Add your first
          category to organize pharmaceutical products.
        </p>
        <Link
          href={ROUTES.adminCategoryNew}
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <IconPlus className="size-4 mr-1.5" aria-hidden="true" />
          <span>Add First Category</span>
        </Link>
      </Card>
    );
  }

  return (
    <DndContext
      id="category-sortable-list"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      accessibility={{ announcements }}
    >
      <SortableContext
        items={categories.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          className="flex flex-col gap-2 list-none p-0 m-0"
          aria-label="Sortable categories list"
        >
          {categories.map((category) => (
            <SortableCategoryRow
              key={category.id}
              category={category}
              disabled={isPending}
              onDelete={() => handleDeleteCategory(category)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

interface SortableCategoryRowProps {
  category: CategoryWithProductCount;
  disabled?: boolean;
  onDelete: () => void;
}

function SortableCategoryRow({
  category,
  disabled,
  onDelete,
}: SortableCategoryRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  let imageUrl: string | null = null;
  if (category.imageKey) {
    try {
      imageUrl = getImageUrl(category.imageKey);
    } catch {
      imageUrl = null;
    }
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 border border-border bg-card p-3 shadow-xs transition-opacity ${
        isDragging ? "z-10 opacity-60 shadow-lg ring-2 ring-primary" : ""
      }`}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="cursor-grab p-1 text-muted-foreground hover:text-foreground touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Drag handle to reorder ${category.name}`}
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <IconGripVertical className="size-4" aria-hidden="true" />
      </button>

      {/* Category Image Thumbnail or Fallback Tile */}
      <div className="relative size-12 shrink-0 overflow-hidden border border-border bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center p-1 text-center bg-muted/80">
            <span className="text-[9px] leading-tight text-muted-foreground font-medium select-none">
              Uses first product image
            </span>
          </div>
        )}
      </div>

      {/* Category Info */}
      <div className="flex flex-1 min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            {category.name}
          </span>
          <Badge variant="outline" className="text-[10px]">
            {category.productCount}{" "}
            {category.productCount === 1 ? "product" : "products"}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {category.slug}
        </p>
      </div>

      {/* Row Actions */}
      <div className="flex items-center gap-1">
        <Link
          href={ROUTES.adminCategoryEdit(category.id)}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon-xs" }),
          )}
          aria-label={`Edit ${category.name}`}
        >
          <IconPencil className="size-3.5" aria-hidden="true" />
        </Link>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                variant="destructive"
                size="icon-xs"
                aria-label={`Delete ${category.name}`}
                disabled={disabled}
              />
            }
          >
            <IconTrash className="size-3.5" aria-hidden="true" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <strong className="text-foreground">{category.name}</strong>?
                {category.productCount > 0 ? (
                  <span className="block mt-2 font-medium text-destructive">
                    This category currently has {category.productCount}{" "}
                    associated{" "}
                    {category.productCount === 1 ? "product" : "products"}. You
                    must move or delete its products first before deleting the
                    category.
                  </span>
                ) : (
                  " This action is permanent and will delete the category entry."
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>
                Delete Category
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}
