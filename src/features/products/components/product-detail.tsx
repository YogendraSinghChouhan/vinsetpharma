import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PRODUCT_NOTICE } from "@/features/marketing/content";
import { getImageUrl } from "@/features/storage/image-url";
import { cn } from "@/lib/utils";
import type { PublicProduct } from "../public-data";

type ProductDetailProps = {
  product: PublicProduct;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const imageUrl = getImageUrl(product.imageKey);

  return (
    <article className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-start">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted/30 p-6 sm:p-10">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-4"
        />
      </div>

      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {product.title}
        </h1>
        <p className="mt-3 text-lg font-medium text-primary sm:text-xl">
          {product.tagline}
        </p>

        <div className="mt-8">
          <Link
            href="#request-quote"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Request a Quote
          </Link>
        </div>

        <div className="mt-8 border-t pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Product Overview
          </h2>
          <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground sm:text-lg">
            {product.description}
          </div>
          <p className="mt-5 rounded-lg border border-border/70 bg-muted/40 p-3 text-sm leading-relaxed text-muted-foreground">
            {PRODUCT_NOTICE}
          </p>
        </div>
      </div>
    </article>
  );
}
