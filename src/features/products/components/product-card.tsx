import Image from "next/image";
import Link from "next/link";
import { BlisterPocket } from "@/components/brand/blister-pocket";
import { ROUTES } from "@/config/site";
import { getImageUrl } from "@/features/storage/image-url";
import type { PublicProduct } from "../public-data";

type ProductCardProps = {
  product: PublicProduct;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const imageUrl = getImageUrl(product.imageKey);

  return (
    <Link
      href={ROUTES.productDetail(product.slug)}
      aria-label={product.title}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-4 transition-colors duration-200 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-2xs"
    >
      {/* Blister Pocket: Softly inset recessed cavity */}
      <BlisterPocket
        depth="subtle"
        interactive
        className="relative aspect-4/3 w-full p-4 flex items-center justify-center"
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

      <div className="flex flex-1 flex-col pt-4 px-1 pb-1">
        <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {product.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.tagline}
        </p>
      </div>
    </Link>
  );
}
