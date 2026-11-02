import Image from "next/image";
import Link from "next/link";
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
import { buttonVariants } from "@/components/ui/button";
import { env } from "@/config/env";
import { ROUTES } from "@/config/site";
import {
  getPublishedPostBySlug,
  getPublishedPostSlugs,
} from "@/features/blogs/public-data";
import { getPlainTextExcerpt } from "@/features/blogs/sanitize";
import { getImageUrl } from "@/features/storage/image-url";
import { createPageMetadata } from "@/lib/metadata";
import { buildBlogPosting, buildBreadcrumbList } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Prerenders all published blog detail pages.
 * Under Cache Components, generateStaticParams must return at least one param object;
 * when no posts are published, returning a placeholder param allows build-time validation
 * while safely resolving to notFound() during runtime/prerender as documented by Next.js.
 */
export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  if (slugs.length === 0) {
    return [{ slug: "__placeholder__" }];
  }
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  if (slug === "__placeholder__") {
    notFound();
  }

  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const excerpt = getPlainTextExcerpt(post.content, 160);
  const imageUrl = getImageUrl(post.coverImageKey);

  return createPageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || excerpt,
    path: ROUTES.blogDetail(post.slug),
    image: imageUrl,
    type: "article",
    publishedTime: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  if (slug === "__placeholder__") {
    notFound();
  }

  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = getImageUrl(post.coverImageKey);
  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(post.publishedAt))
    : null;

  const isoDate = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : undefined;

  const baseUrl = env.APP_URL.replace(/\/+$/, "");
  const postUrl = `${baseUrl}${ROUTES.blogDetail(post.slug)}`;
  const excerpt = getPlainTextExcerpt(post.content, 160);

  const structuredData = [
    buildBlogPosting({
      headline: post.title,
      description: post.seoDescription || excerpt,
      url: postUrl,
      image: imageUrl || undefined,
      datePublished: isoDate,
      dateModified: post.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : undefined,
    }),
    buildBreadcrumbList([
      { name: "Home", url: `${baseUrl}${ROUTES.home}` },
      { name: "Blog", url: `${baseUrl}${ROUTES.blog}` },
      { name: post.title, url: postUrl },
    ]),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <JsonLd data={structuredData} />
      <article className="mx-auto max-w-4xl">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6 sm:mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={ROUTES.home}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={ROUTES.blog}>Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header section */}
        <header className="mb-8 space-y-4">
          {formattedDate && isoDate ? (
            <time
              dateTime={isoDate}
              className="block text-sm font-medium text-muted-foreground"
            >
              {formattedDate}
            </time>
          ) : null}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
        </header>

        {/* Large Cover Image */}
        {imageUrl ? (
          <div className="relative mb-10 aspect-16/9 w-full overflow-hidden rounded-xl border bg-muted shadow-sm">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        {/* Post body */}
        <div
          className="prose prose-slate dark:prose-invert max-w-none text-foreground leading-relaxed sm:text-lg"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized strictly with sanitize-html on the server at write time
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer Navigation */}
        <div className="mt-14 border-t pt-8">
          <Link
            href={ROUTES.blog}
            className={cn(buttonVariants({ variant: "ghost" }), "gap-2 pl-0!")}
          >
            <span aria-hidden="true">&larr;</span>
            <span>Back to all posts</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
