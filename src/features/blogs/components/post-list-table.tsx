"use client";

import {
  IconAlertCircle,
  IconArticle,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { ROUTES } from "@/config/site";
import { getImageUrl } from "@/features/storage/image-url";
import { cn } from "@/lib/utils";
import { deletePost, setPostPublished } from "../actions";
import type { AdminPostSummary } from "../data";

interface PostListTableProps {
  initialPosts: AdminPostSummary[];
}

export function PostListTable({ initialPosts }: PostListTableProps) {
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

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card p-12 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <IconArticle className="size-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-base font-semibold">No blog posts yet</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
          Create your first article or announcement to share insights and
          updates.
        </p>
        <div className="mt-6">
          <Link
            href={ROUTES.adminBlogNew}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <IconPlus className="size-4 mr-1.5" aria-hidden="true" />
            <span>Create your first post</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Cover</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-28">Status</TableHead>
            <TableHead className="w-36">Published Date</TableHead>
            <TableHead className="w-24 text-center">Visible</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => {
            const imageUrl = getImageUrl(post.coverImageKey);
            const formattedPublishedDate = post.publishedAt
              ? new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(new Date(post.publishedAt))
              : "—";

            return (
              <TableRow key={post.id}>
                {/* Cover Thumbnail */}
                <TableCell className="p-2">
                  <div className="relative size-12 overflow-hidden rounded-md border bg-muted shrink-0">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <IconArticle className="size-5" />
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Title & Slug */}
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="line-clamp-1 text-foreground">
                      {post.title}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      /blog/{post.slug}
                    </span>
                  </div>
                </TableCell>

                {/* Status Badge */}
                <TableCell>
                  {post.published ? (
                    <Badge variant="default" className="text-xs font-medium">
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs font-medium">
                      Draft
                    </Badge>
                  )}
                </TableCell>

                {/* Published Date */}
                <TableCell className="text-sm text-muted-foreground">
                  {post.publishedAt ? (
                    <time dateTime={new Date(post.publishedAt).toISOString()}>
                      {formattedPublishedDate}
                    </time>
                  ) : (
                    formattedPublishedDate
                  )}
                </TableCell>

                {/* Publish Switch */}
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Switch
                      checked={post.published}
                      onCheckedChange={(checked) =>
                        handleTogglePublish(post, checked)
                      }
                      disabled={isPending}
                      aria-label={`Toggle publication for ${post.title}`}
                    />
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={ROUTES.adminBlogEdit(post.id)}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-8 text-muted-foreground hover:text-foreground",
                      )}
                      aria-label={`Edit ${post.title}`}
                    >
                      <IconPencil className="size-4" aria-hidden="true" />
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                          "size-8 text-muted-foreground hover:text-destructive focus-visible:ring-destructive",
                        )}
                        aria-label={`Delete ${post.title}`}
                      >
                        <IconTrash className="size-4" aria-hidden="true" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <div className="flex items-center gap-2 text-destructive">
                            <IconAlertCircle className="size-5" />
                            <AlertDialogTitle>
                              Delete Blog Post
                            </AlertDialogTitle>
                          </div>
                          <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-foreground">
                              &ldquo;{post.title}&rdquo;
                            </span>
                            ? This action will permanently remove the post and
                            its cover image from storage. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => handleDeletePost(post)}
                          >
                            Delete Post
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
