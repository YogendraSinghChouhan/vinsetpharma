import { IconArrowRight, IconPackage } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { BlisterPocket } from "@/components/brand/blister-pocket";
import { SHOWCASE_CARD_STYLES } from "@/components/brand/showcase-card";
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
      className={cn(SHOWCASE_CARD_STYLES.container, className)}
    >
      {/* Blister Pocket: Softly inset recessed cavity */}
      <BlisterPocket
        depth="subtle"
        interactive
        className={SHOWCASE_CARD_STYLES.pocket}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={SHOWCASE_CARD_STYLES.image}
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center text-muted-foreground/70">
            <IconPackage className="size-10" aria-hidden="true" />
          </div>
        )}
      </BlisterPocket>

      <div className={SHOWCASE_CARD_STYLES.content}>
        <h3 className={SHOWCASE_CARD_STYLES.title}>{category.name}</h3>

        <div className="mt-4 flex flex-1 flex-col justify-end pt-3 border-t border-border/40">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {productCountLabel}
            </span>
            <span className="inline-flex min-h-[32px] items-center gap-1 rounded-full border border-border bg-surface-tint px-3 py-1 text-xs font-semibold text-primary transition-colors group-hover:border-primary/50 group-hover:bg-primary group-hover:text-primary-foreground">
              <span>View products</span>
              <IconArrowRight
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
