import { IconPlus } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { z } from "zod";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/config/site";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { BlogListSkeleton } from "@/features/blogs/components/blog-list-skeleton";
import { BlogsAdminPagination } from "@/features/blogs/components/blogs-admin-pagination";
import { PostListTable } from "@/features/blogs/components/post-list-table";
import { ADMIN_POSTS_PAGE_SIZE } from "@/features/blogs/constants";
import { listPosts } from "@/features/blogs/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blogs | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminBlogsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function parsePageParam(rawPage: string | string[] | undefined): number {
  const value = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const result = z.coerce.number().int().positive().safeParse(value);
  return result.success ? result.data : 1;
}

async function BlogsContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = parsePageParam(resolvedParams.page);

  const { items, totalPages } = await listPosts({
    page,
    pageSize: ADMIN_POSTS_PAGE_SIZE,
  });

  return (
    <div className="space-y-4">
      <PostListTable initialPosts={items} />
      <BlogsAdminPagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}

export default function AdminBlogsPage({ searchParams }: AdminBlogsPageProps) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog Posts"
        description="Write and publish pharmaceutical articles, company insights, and regulatory updates."
        actions={
          <Link
            href={ROUTES.adminBlogNew}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <IconPlus className="size-4 mr-1.5" aria-hidden="true" />
            <span>New post</span>
          </Link>
        }
      />
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
