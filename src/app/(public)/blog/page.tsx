import { notFound } from "next/navigation";
import { z } from "zod";
import { ROUTES } from "@/config/site";
import { BlogGrid } from "@/features/blogs/components/blog-grid";
import { BlogPagination } from "@/features/blogs/components/blog-pagination";
import { PUBLIC_POSTS_PAGE_SIZE } from "@/features/blogs/constants";
import { isSuitableForPublicCopy } from "@/features/blogs/public-copy";
import { getPublishedPostsPage } from "@/features/blogs/public-data";
import { PageHeader } from "@/features/marketing/components/page-header";
import { HOME_COPY } from "@/features/marketing/content";
import { createPageMetadata } from "@/lib/metadata";

type BlogPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function parsePageParam(rawPage: string | string[] | undefined): number {
  if (rawPage === undefined) return 1;
  const value = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  if (!value) return 1;
  const result = z.coerce.number().int().positive().safeParse(value);
  if (!result.success || String(result.data) !== value) {
    return 1;
  }
  return result.data;
}

export const instant = false;

export async function generateMetadata({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const page = parsePageParam(resolvedParams.page);

  if (page > 1) {
    const { totalPages } = await getPublishedPostsPage({
      page: 1,
      pageSize: PUBLIC_POSTS_PAGE_SIZE,
    });
    if (page > totalPages) {
      notFound();
    }
  }

  const title = page > 1 ? `Blog (Page ${page})` : "Blog & Insights";
  const path = page > 1 ? `${ROUTES.blog}?page=${page}` : ROUTES.blog;

  return createPageMetadata({
    title,
    description: HOME_COPY.blogIntro,
    path,
  });
}

async function BlogCatalog({ page }: { page: number }) {
  const { items, totalPages } = await getPublishedPostsPage({
    page,
    pageSize: PUBLIC_POSTS_PAGE_SIZE,
  });

  const publicItems = items.filter(isSuitableForPublicCopy);

  if (publicItems.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        <p className="text-lg font-medium">
          {" "}
          No articles are currently published.
        </p>
        <p className="mt-2 text-sm">
          Please check back later for product information and company updates.
        </p>
      </div>
    );
  }

  return (
    <>
      <BlogGrid posts={publicItems} />
      <BlogPagination currentPage={page} totalPages={totalPages} />
    </>
  );
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const page = parsePageParam(resolvedParams.page);

  // Validate page bounds BEFORE streaming begins so invalid pages yield a real HTTP 404
  if (page > 1) {
    const { totalPages } = await getPublishedPostsPage({
      page: 1,
      pageSize: PUBLIC_POSTS_PAGE_SIZE,
    });
    if (page > totalPages) {
      notFound();
    }
  }

  return (
    <>
      <PageHeader
        title="Blog & Insights"
        description={HOME_COPY.blogIntro}
        crumbs={[{ label: "Home", href: ROUTES.home }, { label: "Blog" }]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <BlogCatalog page={page} />
      </div>
    </>
  );
}
