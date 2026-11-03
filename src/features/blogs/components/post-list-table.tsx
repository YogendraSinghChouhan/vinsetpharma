"use client";

import { IconArticle, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { ROUTES } from "@/config/site";
import { AdminPagination } from "@/features/admin-shell/components/admin-pagination";
import { cn } from "@/lib/utils";
import { deletePost, setPostPublished } from "../actions";
import { ADMIN_POSTS_PAGE_SIZE } from "../constants";
import type { AdminPostSummary } from "../data";
import { PostRowCard } from "./post-row-card";

export interface PostListTableProps {
  initialPosts: AdminPostSummary[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  publishedCount: number;
  draftCount: number;
}

export function PostListTable({
  initialPosts,
  totalItems,
  totalPages,
  currentPage,
  publishedCount,
  draftCount,
}: PostListTableProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<AdminPostSummary[]>(initialPosts);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  async function handleTogglePublish(
    post: AdminPostSummary,
    published: boolean,
  ) {
    const previousPosts = posts;
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, published } : p)),
    );

    startTransition(async () => {
      const res = await setPostPublished({
        id: post.id,
        published,
      });

      if (!res.success) {
        setPosts(previousPosts);
        toast.add({
          title: "Update failed",
          description: res.error,
          type: "error",
        });
      } else {
        toast.add({
          title: published ? "Post published" : "Post unpublished",
          description: `"${post.title}" is now ${published ? "visible" : "hidden"} on the blog.`,
          type: "success",
        });
        router.refresh();
      }
    });
  }

  async function handleDeletePost(post: AdminPostSummary) {
    const previousPosts = posts;
    setPosts((prev) => prev.filter((p) => p.id !== post.id));

    startTransition(async () => {
      const res = await deletePost(post.id);

      if (!res.success) {
        setPosts(previousPosts);
        toast.add({
          title: "Delete failed",
          description: res.error,
          type: "error",
        });
      } else {
        toast.add({
          title: "Post deleted",
          description: `"${post.title}" has been permanently removed.`,
          type: "success",
        });
        router.refresh();
      }
    });
  }

  if (totalItems === 0) {
    return (
      <Card className="flex flex-col items-center justify-center border border-dashed border-border bg-card p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground mb-4">
          <IconArticle className="size-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-foreground">
          No blog posts yet
        </h3>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground mb-6">
          Create your first article or company update to share pharmaceutical
          insights with visitors.
        </p>
        <Link
          href={ROUTES.adminBlogNew}
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <IconPlus className="size-4 mr-1.5" aria-hidden="true" />
          <span>Create your first post</span>
        </Link>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Summary Chips Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-border bg-card p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="outline"
            className="text-xs font-semibold px-2.5 py-0.5"
          >
            Total: <span className="ml-1 text-foreground">{totalItems}</span>
          </Badge>
          <Badge
            variant="default"
            className="text-xs font-semibold px-2.5 py-0.5"
          >
            Published:{" "}
            <span className="ml-1 text-primary-foreground">
              {publishedCount}
            </span>
          </Badge>
          <Badge
            variant="secondary"
            className="text-xs font-semibold px-2.5 py-0.5"
          >
            Drafts: <span className="ml-1 text-foreground">{draftCount}</span>
          </Badge>
        </div>

        <span className="text-[11px] text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Row Cards List */}
      <ul
        className="flex flex-col gap-2.5 list-none p-0 m-0"
        aria-label="Blog posts list"
      >
        {posts.map((post) => (
          <PostRowCard
            key={post.id}
            post={post}
            disabled={isPending}
            onTogglePublish={(checked) => handleTogglePublish(post, checked)}
            onDelete={() => handleDeletePost(post)}
          />
        ))}
      </ul>

      {/* Shared Admin Pagination */}
      <AdminPagination
        page={currentPage}
        totalPages={totalPages}
        basePath={ROUTES.adminBlogs}
        totalItems={totalItems}
        pageSize={ADMIN_POSTS_PAGE_SIZE}
      />
    </div>
  );
}
