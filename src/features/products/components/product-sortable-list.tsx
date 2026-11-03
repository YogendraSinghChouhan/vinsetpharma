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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  IconBox,
  IconGripVertical,
  IconPlus,
  IconStarFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ROUTES } from "@/config/site";
import { AdminPagination } from "@/features/admin-shell/components/admin-pagination";
import { cn } from "@/lib/utils";
import {
  deleteProduct,
  reorderProducts,
  setProductFeaturedAction,
  setProductPublished,
} from "../actions";
import {
  ADMIN_PRODUCTS_PAGE_SIZE,
  FEATURED_PRODUCTS_LIMIT,
} from "../constants";
import type { ProductListItem } from "../data";
import type { Product } from "../schema";
import { ProductSortableRow } from "./product-sortable-row";

export interface ProductSortableListProps {
  initialProducts: ProductListItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  publishedCount: number;
  featuredCount: number;
}

export function ProductSortableList({
  initialProducts,
  total,
  totalPages,
  currentPage,
  publishedCount,
  featuredCount,
}: ProductSortableListProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductListItem[]>(initialProducts);
  const [isPending, startTransition] = useTransition();

  const draftsCount = Math.max(0, total - publishedCount);

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
      return `Picked up product "${item?.title ?? ""}". Position ${index} of ${products.length} on page ${currentPage}. Use arrow keys to reorder, spacebar to drop.`;
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
          description: "Product arrangement on this page has been saved.",
          type: "success",
        });
        router.refresh();
      }
    });
  }

  async function handleTogglePublish(product: Product, published: boolean) {
    const previousProducts = products;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? { ...p, published, featured: published ? p.featured : false }
          : p,
      ),
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

  async function handleToggleFeatured(
    product: ProductListItem,
    featured: boolean,
  ) {
    const previousProducts = products;
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, featured } : p)),
    );

    startTransition(async () => {
      const res = await setProductFeaturedAction({
        id: product.id,
        featured,
      });

      if (!res.success) {
        setProducts(previousProducts);
        toast.add({
          title: "Featured update failed",
          description: res.error,
          type: "error",
        });
      } else {
        toast.add({
          title: featured ? "Product featured" : "Removed from featured",
          description: featured
            ? `"${product.title}" is now featured on the home page.`
            : `"${product.title}" was removed from the home page featured list.`,
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

  if (total === 0) {
    return (
      <Card className="flex flex-col items-center justify-center border border-dashed border-border bg-card p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground mb-4">
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
    <TooltipProvider delay={200}>
      <div className="flex flex-col gap-4">
        {/* Summary Chips & Guidance Header */}
        <div className="flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3.5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className="text-xs font-semibold px-2.5 py-0.5"
              >
                Total: <span className="ml-1 text-foreground">{total}</span>
              </Badge>
              <Badge
                variant="default"
                className="text-xs font-semibold px-2.5 py-0.5"
              >
                Published:{" "}
                <span className="ml-1 text-primary-foreground">
                  {publishedCount}
                </span>
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs font-semibold px-2.5 py-0.5"
              >
                Drafts:{" "}
                <span className="ml-1 text-foreground">{draftsCount}</span>
              </Badge>
              <Badge
                variant="outline"
                className="text-xs font-semibold px-2.5 py-0.5 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300 gap-1"
              >
                <IconStarFilled
                  className="size-3 text-amber-500"
                  aria-hidden="true"
                />
                <span>
                  Featured: {featuredCount} of {FEATURED_PRODUCTS_LIMIT}
                </span>
              </Badge>
            </div>

            <span className="text-[11px] text-muted-foreground hidden lg:inline-block">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <IconGripVertical className="size-4 shrink-0 text-muted-foreground/70" />
            <p>
              Drag to arrange within this page. The home page and product pages
              follow this order.
            </p>
          </div>
        </div>

        {/* Sortable Products List (Current page subset) */}
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
              className="flex flex-col gap-2.5 list-none p-0 m-0"
              aria-label="Sortable products list"
            >
              {products.map((product) => (
                <ProductSortableRow
                  key={product.id}
                  product={product}
                  disabled={isPending}
                  onTogglePublish={(checked) =>
                    handleTogglePublish(product, checked)
                  }
                  onToggleFeatured={(featured) =>
                    handleToggleFeatured(product, featured)
                  }
                  onDelete={() => handleDeleteProduct(product)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        {/* Shared Admin Pagination */}
        <AdminPagination
          page={currentPage}
          totalPages={totalPages}
          basePath={ROUTES.adminProducts}
          totalItems={total}
          pageSize={ADMIN_PRODUCTS_PAGE_SIZE}
        />
      </div>
    </TooltipProvider>
  );
}
