"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconAlertCircle,
  IconBox,
  IconDotsVertical,
  IconGripVertical,
  IconPencil,
  IconStar,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROUTES } from "@/config/site";
import { getImageUrl } from "@/features/storage/image-url";
import { cn } from "@/lib/utils";
import type { ProductListItem } from "../data";

export interface ProductSortableRowProps {
  product: ProductListItem;
  disabled?: boolean;
  onTogglePublish: (checked: boolean) => void;
  onToggleFeatured: (featured: boolean) => void;
  onDelete: () => void;
}

export function ProductSortableRow({
  product,
  disabled,
  onTogglePublish,
  onToggleFeatured,
  onDelete,
}: ProductSortableRowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const taglineOrSlug = product.tagline || `/products/${product.slug}`;

  return (
    <>
      <li
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-xs transition-shadow",
          isDragging && "z-20 opacity-70 shadow-md ring-2 ring-primary",
        )}
      >
        {/* Left: Drag handle, Pocket well thumbnail, Details */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {/* Drag Handle (44px target) */}
          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-muted-foreground hover:text-foreground touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0 cursor-grab active:cursor-grabbing rounded-md"
            aria-label={`Drag to reorder ${product.title}`}
            disabled={disabled}
            {...attributes}
            {...listeners}
          >
            <IconGripVertical className="size-5" aria-hidden="true" />
          </button>

          {/* Pocket Well Thumbnail (Blister motif: recessed cavity, object-contain) */}
          <div
            className="relative size-12 shrink-0 rounded-md border border-border/80 bg-surface-tint p-1 shadow-[inset_0_2px_4px_rgba(0,40,50,0.05)] overflow-hidden flex items-center justify-center"
            title={product.title}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                sizes="48px"
                className="object-contain p-0.5"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <IconBox className="size-5" aria-hidden="true" />
              </div>
            )}
          </div>

          {/* Title & Tagline & Badges */}
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span
                className="truncate text-sm font-semibold text-foreground max-w-[200px] sm:max-w-xs md:max-w-sm"
                title={product.title}
              >
                {product.title}
              </span>

              <Badge
                variant={product.published ? "default" : "secondary"}
                className="text-[10px] uppercase tracking-wider font-semibold"
              >
                {product.published ? "Published" : "Draft"}
              </Badge>

              {product.featured && (
                <Badge
                  variant="default"
                  className="text-[10px] bg-amber-500 hover:bg-amber-600 text-white border-transparent gap-1 font-semibold"
                >
                  <IconStarFilled className="size-2.5" aria-hidden="true" />
                  <span>Featured</span>
                </Badge>
              )}

              {product.categoryName ? (
                <Badge
                  variant="outline"
                  className="text-[10px] hidden md:inline-flex max-w-[130px] truncate"
                  title={product.categoryName}
                >
                  {product.categoryName}
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="text-[10px] hidden md:inline-flex text-muted-foreground"
                >
                  No category
                </Badge>
              )}
            </div>

            <p
              className="truncate text-xs text-muted-foreground"
              title={taglineOrSlug}
            >
              {taglineOrSlug}
            </p>
          </div>
        </div>

        {/* Right: Controls & Actions (Featured toggle, Publish switch, Overflow menu) */}
        <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t border-border/50 sm:border-0 pl-12 sm:pl-0">
          {/* Featured Star Toggle */}
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  disabled={disabled || !product.published}
                  onClick={() => onToggleFeatured(!product.featured)}
                  aria-label={
                    product.featured
                      ? `Remove ${product.title} from home page featured`
                      : `Feature ${product.title} on home page`
                  }
                  aria-pressed={product.featured}
                  className={cn(
                    "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
                    product.featured && "text-amber-500",
                  )}
                >
                  {product.featured ? (
                    <IconStarFilled
                      className="size-5 text-amber-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <IconStar className="size-5" aria-hidden="true" />
                  )}
                </button>
              }
            />
            {!product.published ? (
              <TooltipContent side="top">
                Only published products can be featured
              </TooltipContent>
            ) : (
              <TooltipContent side="top">
                {product.featured
                  ? "Featured on home page"
                  : "Feature on home page"}
              </TooltipContent>
            )}
          </Tooltip>

          {/* Publish Switch (44px target) */}
          <div className="flex min-h-[44px] items-center gap-1.5 px-2">
            <label
              htmlFor={`publish-${product.id}`}
              className="text-xs text-muted-foreground select-none cursor-pointer hidden sm:inline-block"
            >
              {product.published ? "Active" : "Draft"}
            </label>
            <Switch
              id={`publish-${product.id}`}
              checked={product.published}
              onCheckedChange={onTogglePublish}
              disabled={disabled}
              aria-label={`Toggle publication for ${product.title}`}
            />
          </div>

          {/* Overflow Menu with Edit and Delete */}
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Actions for ${product.title}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "min-h-[44px] min-w-[44px] text-muted-foreground hover:text-foreground",
              )}
            >
              <IconDotsVertical className="size-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                render={
                  <Link
                    href={ROUTES.adminProductEdit(product.id)}
                    className="flex items-center gap-2 w-full"
                  />
                }
              >
                <IconPencil className="size-3.5" aria-hidden="true" />
                <span>Edit Product</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <IconTrash className="size-3.5" aria-hidden="true" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </li>

      {/* Retained AlertDialog for Delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <IconAlertCircle className="size-5" aria-hidden="true" />
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">{product.title}</strong>? This
              action cannot be undone and will remove the product and its image
              from the catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setDeleteDialogOpen(false);
                onDelete();
              }}
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
