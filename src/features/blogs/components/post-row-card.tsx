"use client";

import {
  IconAlertCircle,
  IconArticle,
  IconCalendar,
  IconDotsVertical,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/config/site";
import { getImageUrl } from "@/features/storage/image-url";
import { cn } from "@/lib/utils";
import type { AdminPostSummary } from "../data";

export interface PostRowCardProps {
  post: AdminPostSummary;
  disabled?: boolean;
  onTogglePublish: (checked: boolean) => void;
  onDelete: () => void;
}

export function PostRowCard({
  post,
  disabled,
  onTogglePublish,
  onDelete,
}: PostRowCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  let imageUrl: string | null = null;
  try {
    imageUrl = getImageUrl(post.coverImageKey);
  } catch {
    imageUrl = null;
  }

  const formattedPublishedDate = post.publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(post.publishedAt))
    : "—";

  return (
    <>
      <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-xs transition-shadow">
        {/* Left: Thumbnail & Post details */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {/* Cover Thumbnail in Pocket Well */}
          <div
            className="relative size-12 shrink-0 rounded-md border border-border/80 bg-surface-tint p-0.5 shadow-[inset_0_2px_4px_rgba(0,40,50,0.05)] overflow-hidden flex items-center justify-center"
            title={post.title}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                sizes="48px"
                className="object-cover rounded-sm"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <IconArticle className="size-5" aria-hidden="true" />
              </div>
            )}
          </div>

          {/* Title, Slug & Metadata */}
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span
                className="truncate text-sm font-semibold text-foreground max-w-[200px] sm:max-w-xs md:max-w-sm"
                title={post.title}
              >
                {post.title}
              </span>

              <Badge
                variant={post.published ? "default" : "secondary"}
                className="text-[10px] uppercase tracking-wider font-semibold"
              >
                {post.published ? "Published" : "Draft"}
              </Badge>

              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <IconCalendar className="size-3 text-muted-foreground/70" />
                {post.publishedAt ? (
                  <time dateTime={new Date(post.publishedAt).toISOString()}>
                    {formattedPublishedDate}
                  </time>
                ) : (
                  <span>Draft — not published</span>
                )}
              </span>
            </div>

            <p
              className="truncate text-xs font-mono text-muted-foreground"
              title={`/blog/${post.slug}`}
            >
              /blog/{post.slug}
            </p>
          </div>
        </div>

        {/* Right: Controls (Publish switch, Overflow menu) */}
        <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t border-border/50 sm:border-0 pl-14 sm:pl-0">
          {/* Publish Switch (44px target) */}
          <div className="flex min-h-[44px] items-center gap-1.5 px-2">
            <label
              htmlFor={`publish-post-${post.id}`}
              className="text-xs text-muted-foreground select-none cursor-pointer hidden sm:inline-block"
            >
              {post.published ? "Published" : "Draft"}
            </label>
            <Switch
              id={`publish-post-${post.id}`}
              checked={post.published}
              onCheckedChange={onTogglePublish}
              disabled={disabled}
              aria-label={`Toggle publication for ${post.title}`}
            />
          </div>

          {/* Overflow Menu with Edit and Delete */}
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Actions for ${post.title}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "min-h-[44px] min-w-[44px] text-muted-foreground hover:text-foreground",
              )}
            >
              <IconDotsVertical className="size-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                render={
                  <Link
                    href={ROUTES.adminBlogEdit(post.id)}
                    className="flex items-center gap-2 w-full"
                  />
                }
              >
                <IconPencil className="size-3.5" aria-hidden="true" />
                <span>Edit Post</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <IconTrash className="size-3.5" aria-hidden="true" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </li>

      {/* Retained AlertDialog for Delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <IconAlertCircle className="size-5" aria-hidden="true" />
              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">
                &ldquo;{post.title}&rdquo;
              </strong>
              ? This action cannot be undone and will permanently remove the
              article and its cover image from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setDeleteDialogOpen(false);
                onDelete();
              }}
            >
              Delete Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
