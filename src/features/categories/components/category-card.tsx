import { IconArrowRight, IconPackage } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { BlisterPocket } from "@/components/brand/blister-pocket";
import { getImageUrl } from "@/features/storage/image-url";
import { cn } from "@/lib/utils";
import { CATEGORY_ROUTES } from "../constants";
import type { PublicCategory } from "../public-data";

type CategoryCardProps = {
  category: PublicCategory;
  className?: string;
};

export function CategoryCard({ category, className }: CategoryCardProps) {
  let imageUrl: string | null = null;
  if (category.imageKey) {
    try {
      imageUrl = getImageUrl(category.imageKey);
    } catch {
      imageUrl = null;
    }
  }

  return (
    <Link
      href={CATEGORY_ROUTES.categoryDetail(category.slug)}
      aria-label={`Browse ${category.name} (${category.productCount} products)`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-2xs",
        className,
      )}
    >
      <BlisterPocket
        depth="subtle"
        interactive
        className="relative aspect-4/3 w-full p-3 flex items-center justify-center overflow-hidden"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center text-muted-foreground/70">
            <IconPackage className="size-8" aria-hidden="true" />
          </div>
        )}
      </BlisterPocket>

      <div className="flex flex-1 flex-col justify-between pt-3 px-1">
        <div>
          <h3 className="font-heading text-base sm:text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-1">
            {category.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {category.productCount}{" "}
            {category.productCount === 1 ? "Product" : "Products"}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary/80 transition-colors group-hover:text-primary">
          <span>Explore</span>
          <IconArrowRight
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
