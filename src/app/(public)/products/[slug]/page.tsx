import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { env } from "@/config/env";
import { ROUTES } from "@/config/site";
import { ProductDetail } from "@/features/products/components/product-detail";
import { RelatedProductsSection } from "@/features/products/components/related-products";
import {
  getPublishedProductBySlug,
  getPublishedProductSlugs,
} from "@/features/products/public-data";
import { QuoteForm } from "@/features/quotes/components/quote-form";
import { QUOTE_FORM_ANCHOR_ID } from "@/features/quotes/constants";
import { getImageUrl } from "@/features/storage/image-url";
import { createPageMetadata } from "@/lib/metadata";
import { buildBreadcrumbList, buildProduct } from "@/lib/structured-data";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Prerenders all published product detail pages.
 * Under Cache Components, generateStaticParams must return at least one param object;
 * when the catalog is empty, returning a placeholder param allows build-time validation
 * while safely resolving to notFound() during runtime/prerender as documented by Next.js.
 */
export async function generateStaticParams() {
  const slugs = await getPublishedProductSlugs();
  if (slugs.length === 0) {
    return [{ slug: "__placeholder__" }];
  }
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  if (slug === "__placeholder__") {
    notFound();
  }

  const product = await getPublishedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const imageUrl = getImageUrl(product.imageKey);

  return createPageMetadata({
    title: product.title,
    description: product.tagline,
    path: ROUTES.productDetail(product.slug),
    image: imageUrl,
  });
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  if (slug === "__placeholder__") {
    notFound();
  }

  const product = await getPublishedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const baseUrl = env.APP_URL.replace(/\/+$/, "");
  const imageUrl = getImageUrl(product.imageKey);
  const productUrl = `${baseUrl}${ROUTES.productDetail(product.slug)}`;

  const structuredData = [
    buildProduct({
      name: product.title,
      description: product.tagline || product.description,
      url: productUrl,
      image: imageUrl || undefined,
    }),
    buildBreadcrumbList([
      { name: "Home", url: `${baseUrl}${ROUTES.home}` },
      { name: "Our Products", url: `${baseUrl}${ROUTES.products}` },
      { name: product.title, url: productUrl },
    ]),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <JsonLd data={structuredData} />
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={ROUTES.home}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={ROUTES.products}>Our Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ProductDetail product={product} />

      <section
        id={QUOTE_FORM_ANCHOR_ID}
        className="mt-16 border-t pt-12 sm:mt-20 sm:pt-16"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Request a quote for {product.title}
          </h2>
          <p className="mb-8 text-sm text-muted-foreground sm:text-base">
            Submit your enquiry below. Our team will reply by phone or email.
          </p>
          <QuoteForm productId={product.id} />
        </div>
      </section>

      <RelatedProductsSection excludeId={product.id} />
    </div>
  );
}
