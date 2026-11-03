import Image from "next/image";
import Link from "next/link";
import { BlisterPocket } from "@/components/brand/blister-pocket";
import { SHOWCASE_CARD_STYLES } from "@/components/brand/showcase-card";
import { ROUTES } from "@/config/site";
import { getImageUrl } from "@/features/storage/image-url";
import { cn } from "@/lib/utils";
import type { PublicProduct } from "../public-data";

export type ProductCardViewProps = {
  href?: string;
  title: string;
  tagline: string | null;
  imageKey: string | null;
  priority?: boolean;
  className?: string;
  size?: "default" | "lg";
};

/**
 * Presentational view shared between the public ProductCard (as a link)
 * and the admin product form live preview (as a non-link container).
 */
export function ProductCardView({
  href,
  title,
  tagline,
  imageKey,
  priority = false,
  className,
  size = "default",
}: ProductCardViewProps) {
  let imageUrl = "";
  if (imageKey) {
    try {
      imageUrl = getImageUrl(imageKey);
    } catch {
      imageUrl = "";
    }
  }

  const isLarge = size === "lg";

  const content = (
    <>
      {/* Blister Pocket: Softly inset recessed cavity */}
      <BlisterPocket
        depth="subtle"
        interactive={Boolean(href)}
        className={cn(
          SHOWCASE_CARD_STYLES.pocket,
          isLarge && "min-h-[220px] sm:min-h-[260px] p-6",
        )}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title || "Product image"}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={SHOWCASE_CARD_STYLES.image}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground text-xs font-medium">
            <span>No image uploaded</span>
          </div>
        )}
      </BlisterPocket>

      <div className={cn(SHOWCASE_CARD_STYLES.content, isLarge && "pt-5")}>
        <h3
          className={cn(
            SHOWCASE_CARD_STYLES.title,
            isLarge && "text-xl sm:text-2xl",
          )}
        >
          {title || "Untitled Product"}
        </h3>
        <p
          className={cn(
            "mt-2 line-clamp-2 leading-relaxed text-muted-foreground",
            isLarge ? "text-sm sm:text-base" : "text-sm",
          )}
        >
          {tagline || "Product tagline will appear here."}
        </p>
      </div>
    </>
  );

  const containerClasses = cn(
    SHOWCASE_CARD_STYLES.container,
    isLarge && "p-5 sm:p-6",
    !href && "hover:border-border/80 cursor-default",
    className,
  );

  if (href) {
    return (
      <Link href={href} aria-label={title} className={containerClasses}>
        {content}
      </Link>
    );
  }

  return <div className={containerClasses}>{content}</div>;
}

export type ProductCardProps = {
  product: PublicProduct;
  priority?: boolean;
  className?: string;
  size?: "default" | "lg";
};

export function ProductCard({
  product,
  priority = false,
  className,
  size = "default",
}: ProductCardProps) {
  return (
    <ProductCardView
      href={ROUTES.productDetail(product.slug)}
      title={product.title}
      tagline={product.tagline}
      imageKey={product.imageKey}
      priority={priority}
      className={className}
      size={size}
    />
  );
}
