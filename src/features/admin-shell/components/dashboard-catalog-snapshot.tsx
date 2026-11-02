import {
  IconArrowRight,
  IconBox,
  IconExternalLink,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/config/site";
import { getImageUrl } from "@/features/storage/image-url";
import { cn } from "@/lib/utils";
import type { DashboardRecentProduct } from "../data";

type DashboardCatalogSnapshotProps = {
  products: DashboardRecentProduct[];
  totalProducts: number;
};

export function DashboardCatalogSnapshot({
  products,
  totalProducts,
}: DashboardCatalogSnapshotProps) {
  return (
    <Card className="border border-border/70 shadow-2xs overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between p-5 border-b border-border/60 bg-muted/20">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Product Catalog
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Recently created formulations and active listings.
            </p>
          </div>
          <Link
            href={ROUTES.adminProducts}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8 text-xs font-medium text-primary hover:text-primary",
            )}
          >
            Manage ({totalProducts})
            <IconArrowRight className="size-3.5 ml-1" aria-hidden="true" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <IconBox className="size-6 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">
              No products yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
              Add your first pharmaceutical product to make it available to
              healthcare providers.
            </p>
            <div className="mt-4">
              <Link
                href={ROUTES.adminProductNew}
                className={cn(buttonVariants({ size: "sm" }), "text-xs")}
              >
                <IconPlus className="size-3.5 mr-1.5" />
                Add Product
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {products.map((product) => {
              let imageUrl = "";
              try {
                imageUrl = getImageUrl(product.imageKey);
              } catch {
                imageUrl = "";
              }

              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-muted/40 flex items-center justify-center">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.title}
                          fill
                          sizes="44px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <IconBox className="size-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={ROUTES.adminProductEdit(product.id)}
                          className="text-xs font-semibold text-foreground hover:text-primary hover:underline truncate"
                        >
                          {product.title}
                        </Link>
                        <span className="text-[10px] font-mono text-muted-foreground/80 shrink-0">
                          #{product.sortOrder}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {product.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {product.published ? (
                      <Badge className="border-emerald-300/80 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                        Live
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="px-2 py-0.5 text-[10px] text-muted-foreground"
                      >
                        Draft
                      </Badge>
                    )}
                    <Link
                      href={ROUTES.adminProductEdit(product.id)}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "size-8 p-0 text-muted-foreground hover:text-foreground",
                      )}
                      title="Edit product"
                    >
                      <IconPencil className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">Edit {product.title}</span>
                    </Link>
                    {product.published ? (
                      <Link
                        href={ROUTES.productDetail(product.slug)}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "size-8 p-0 text-muted-foreground hover:text-foreground",
                        )}
                        title="View on site"
                      >
                        <IconExternalLink
                          className="size-3.5"
                          aria-hidden="true"
                        />
                        <span className="sr-only">
                          View {product.title} on site
                        </span>
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-3 bg-muted/10 border-t border-border/50 text-right">
        <Link
          href={ROUTES.adminProducts}
          className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
        >
          View all {totalProducts} products
          <IconArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
