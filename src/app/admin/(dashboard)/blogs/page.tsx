import { IconPlus } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/config/site";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import {
  getAdminPageHref,
  parseAdminPageParam,
} from "@/features/admin-shell/pagination-utils";
import { BlogListSkeleton } from "@/features/blogs/components/blog-list-skeleton";
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

async function BlogsContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseAdminPageParam(resolvedParams.page);

  const { items, totalItems, totalPages, publishedCount, draftCount } =
    await listPosts({
      page,
      pageSize: ADMIN_POSTS_PAGE_SIZE,
    });

  if (page > totalPages && totalPages > 0) {
    redirect(getAdminPageHref(ROUTES.adminBlogs, totalPages));
  }

  return (
    <PostListTable
      initialPosts={items}
      totalItems={totalItems}
      totalPages={totalPages}
      currentPage={page}
      publishedCount={publishedCount}
      draftCount={draftCount}
    />
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
