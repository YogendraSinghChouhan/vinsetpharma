import Image from "next/image";
import Link from "next/link";
import { BlisterPocket } from "@/components/brand/blister-pocket";
import { ROUTES } from "@/config/site";
import { getImageUrl } from "@/features/storage/image-url";
import { cn } from "@/lib/utils";
import type { PublicProduct } from "../public-data";

type ProductCardProps = {
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
  const imageUrl = getImageUrl(product.imageKey);
  const isLarge = size === "lg";

  return (
    <Link
      href={ROUTES.productDetail(product.slug)}
      aria-label={product.title}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-colors duration-200 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-2xs",
        isLarge ? "p-5 sm:p-6" : "p-4",
        className,
      )}
    >
      {/* Blister Pocket: Softly inset recessed cavity */}
      <BlisterPocket
        depth="subtle"
        interactive
        className={cn(
          "relative aspect-4/3 w-full flex items-center justify-center overflow-hidden",
          isLarge ? "min-h-[220px] sm:min-h-[260px] p-6" : "p-4",
        )}
      >
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-3 transition-opacity group-hover:opacity-95"
        />
      </BlisterPocket>

      <div
        className={cn(
          "flex flex-1 flex-col px-1 pb-1",
          isLarge ? "pt-5" : "pt-4",
        )}
      >
        <h3
          className={cn(
            "font-heading font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary",
            isLarge ? "text-xl sm:text-2xl" : "text-lg",
          )}
        >
          {product.title}
        </h3>
        <p
          className={cn(
            "mt-2 line-clamp-2 leading-relaxed text-muted-foreground",
            isLarge ? "text-sm sm:text-base" : "text-sm",
          )}
        >
          {product.tagline}
        </p>
      </div>
    </Link>
  );
}
