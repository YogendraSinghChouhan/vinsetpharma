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
  IconAlertCircle,
  IconBox,
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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { ROUTES } from "@/config/site";
import { getImageUrl } from "@/features/storage/image-url";
import { cn } from "@/lib/utils";
import {
  deleteProduct,
  reorderProducts,
  setProductPublished,
} from "../actions";
import type { Product } from "../schema";

interface ProductSortableListProps {
  initialProducts: Product[];
}

export function ProductSortableList({
  initialProducts,
}: ProductSortableListProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isPending, startTransition] = useTransition();

  // Keep local state in sync when server data updates
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

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
      const item = products.find((p) => p.id === active.id);
      const index = products.findIndex((p) => p.id === active.id) + 1;
      return `Picked up product "${item?.title ?? ""}". Position ${index} of ${products.length}. Use arrow keys to reorder, spacebar to drop.`;
    },
    onDragOver({ over }) {
      if (!over) return undefined;
      const overItem = products.find((p) => p.id === over.id);
      const newPos = products.findIndex((p) => p.id === over.id) + 1;
      return `Product is over "${overItem?.title ?? ""}", position ${newPos} of ${products.length}.`;
    },
    onDragEnd({ active, over }) {
      if (!over || active.id === over.id) {
        return "Product dropped with no position change.";
      }
      const newPos = products.findIndex((p) => p.id === over.id) + 1;
      return `Product dropped at position ${newPos} of ${products.length}.`;
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

    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const previousProducts = products;
    const reordered = arrayMove(products, oldIndex, newIndex);
    setProducts(reordered);

    startTransition(async () => {
      const res = await reorderProducts({
        ids: reordered.map((p) => p.id),
      });

      if (!res.success) {
        setProducts(previousProducts);
        toast.add({
          title: "Reorder failed",
          description: res.error,
          type: "error",
        });
      } else {
        toast.add({
          title: "Order updated",
          description: "Product list order has been saved.",
          type: "success",
        });
        router.refresh();
      }
    });
  }

  async function handleTogglePublish(product: Product, published: boolean) {
    const previousProducts = products;
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, published } : p)),
    );

    startTransition(async () => {
      const res = await setProductPublished({
        id: product.id,
        published,
      });

      if (!res.success) {
        setProducts(previousProducts);
        toast.add({
          title: "Update failed",
          description: res.error,
          type: "error",
        });
      } else {
        toast.add({
          title: published ? "Product published" : "Product unpublished",
          description: `"${product.title}" is now ${published ? "visible" : "hidden"} on the public catalog.`,
          type: "success",
        });
        router.refresh();
      }
    });
  }

  async function handleDeleteProduct(product: Product) {
    const previousProducts = products;
    setProducts((prev) => prev.filter((p) => p.id !== product.id));

    startTransition(async () => {
      const res = await deleteProduct(product.id);

      if (!res.success) {
        setProducts(previousProducts);
        toast.add({
          title: "Delete failed",
          description: res.error,
          type: "error",
        });
      } else {
        toast.add({
          title: "Product deleted",
          description: `"${product.title}" has been permanently removed.`,
          type: "success",
        });
        router.refresh();
      }
    });
  }

  if (products.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center border border-dashed border-border bg-card p-12 text-center">
        <div className="flex size-12 items-center justify-center border border-border bg-muted text-muted-foreground mb-4">
          <IconBox className="size-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-foreground">No products yet</h3>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground mb-6">
          Your product catalog is currently empty. Add your first pharmaceutical
          product to showcase it to potential buyers.
        </p>
        <Link
          href={ROUTES.adminProductNew}
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <IconPlus className="size-4 mr-1.5" aria-hidden="true" />
          <span>Add First Product</span>
        </Link>
      </Card>
    );
  }

  return (
    <DndContext
      id="product-sortable-list"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      accessibility={{ announcements }}
    >
      <SortableContext
        items={products.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          className="flex flex-col gap-2 list-none p-0 m-0"
          aria-label="Sortable products list"
        >
          {products.map((product) => (
            <SortableProductRow
              key={product.id}
              product={product}
              disabled={isPending}
              onTogglePublish={(checked) =>
                handleTogglePublish(product, checked)
              }
              onDelete={() => handleDeleteProduct(product)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

interface SortableProductRowProps {
  product: Product;
  disabled?: boolean;
  onTogglePublish: (checked: boolean) => void;
  onDelete: () => void;
}

function SortableProductRow({
  product,
  disabled,
  onTogglePublish,
  onDelete,
}: SortableProductRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  let imageUrl: string | null = null;
  try {
    imageUrl = getImageUrl(product.imageKey);
  } catch {
    imageUrl = null;
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
        aria-label={`Drag handle to reorder ${product.title}`}
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <IconGripVertical className="size-4" aria-hidden="true" />
      </button>

      {/* Product Image Thumbnail */}
      <div className="relative size-12 shrink-0 overflow-hidden border border-border bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <IconAlertCircle className="size-4" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            {product.title}
          </span>
          <Badge
            variant={product.published ? "default" : "secondary"}
            className="text-[10px]"
          >
            {product.published ? "Published" : "Draft"}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {product.tagline || product.slug}
        </p>
      </div>

      {/* Publish Switch */}
      <div className="flex items-center gap-2 px-2">
        <label
          htmlFor={`publish-${product.id}`}
          className="text-xs text-muted-foreground select-none cursor-pointer"
        >
          {product.published ? "Published" : "Hidden"}
        </label>
        <Switch
          id={`publish-${product.id}`}
          checked={product.published}
          onCheckedChange={onTogglePublish}
          disabled={disabled}
          aria-label={`Toggle publication for ${product.title}`}
        />
      </div>

      {/* Row Actions */}
      <div className="flex items-center gap-1">
        <Link
          href={ROUTES.adminProductEdit(product.id)}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon-xs" }),
          )}
          aria-label={`Edit ${product.title}`}
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
                aria-label={`Delete ${product.title}`}
                disabled={disabled}
              />
            }
          >
            <IconTrash className="size-3.5" aria-hidden="true" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <strong className="text-foreground">{product.title}</strong>?
                This action is permanent and will delete the product catalog
                entry and its image from storage.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>
                Delete Product
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}
