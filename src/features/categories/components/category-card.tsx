import { IconArrowRight, IconPackage } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/features/storage/image-url";
import { cn } from "@/lib/utils";
import { CATEGORY_ROUTES } from "../constants";
import type { PublicCategory } from "../public-data";

type CategoryCardProps = {
  category: PublicCategory;
  priority?: boolean;
  className?: string;
};

export function CategoryCard({
  category,
  priority = false,
  className,
}: CategoryCardProps) {
  let imageUrl: string | null = null;
  if (category.imageKey) {
    try {
      imageUrl = getImageUrl(category.imageKey);
    } catch {
      imageUrl = null;
    }
  }

  const productCountLabel =
    category.productCount === 1
      ? "1 product"
      : `${category.productCount} products`;

  return (
    <Link
      href={CATEGORY_ROUTES.categoryDetail(category.slug)}
      aria-label={`Browse ${category.name} (${productCountLabel})`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-white p-3 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:p-4",
        className,
      )}
    >
      <div className="relative aspect-[1.35/1] w-full overflow-hidden rounded-lg bg-surface-tint">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 42vw, 88vw"
            className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center text-muted-foreground/70">
            <IconPackage className="size-10" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 px-2 pb-2 pt-5">
        <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {category.name}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-4">
          <span className="text-xs text-muted-foreground">
            {productCountLabel}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Read More
            <IconArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
