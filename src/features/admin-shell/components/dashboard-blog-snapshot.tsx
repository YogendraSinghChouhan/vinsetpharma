import {
  IconArrowRight,
  IconArticle,
  IconCalendar,
  IconExternalLink,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/config/site";
import { cn } from "@/lib/utils";
import type { DashboardRecentPost } from "../data";

type DashboardBlogSnapshotProps = {
  posts: DashboardRecentPost[];
  totalPosts: number;
};

export function DashboardBlogSnapshot({
  posts,
  totalPosts,
}: DashboardBlogSnapshotProps) {
  return (
    <Card className="border border-border/70 shadow-2xs overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between p-5 border-b border-border/60 bg-muted/20">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Blog & Editorial
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Articles, scientific insights, and industry updates.
            </p>
          </div>
          <Link
            href={ROUTES.adminBlogs}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8 text-xs font-medium text-primary hover:text-primary",
            )}
          >
            Manage ({totalPosts})
            <IconArrowRight className="size-3.5 ml-1" aria-hidden="true" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <IconArticle className="size-6 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">
              No blog posts yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
              Publish news, clinical articles, and educational content for your
              audience.
            </p>
            <div className="mt-4">
              <Link
                href={ROUTES.adminBlogNew}
                className={cn(buttonVariants({ size: "sm" }), "text-xs")}
              >
                <IconPlus className="size-3.5 mr-1.5" />
                Write Post
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between gap-3 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0">
                  <Link
                    href={ROUTES.adminBlogEdit(post.id)}
                    className="text-xs font-semibold text-foreground hover:text-primary hover:underline line-clamp-1"
                  >
                    {post.title}
                  </Link>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 font-mono">
                      <IconCalendar className="size-3 text-muted-foreground/70" />
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "Draft"}
                    </span>
                    <span>•</span>
                    <span className="truncate font-mono text-[10px]">
                      /{post.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {post.published ? (
                    <Badge className="border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                      Published
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      Draft
                    </Badge>
                  )}
                  <Link
                    href={ROUTES.adminBlogEdit(post.id)}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "size-8 p-0 text-muted-foreground hover:text-foreground",
                    )}
                    title="Edit post"
                  >
                    <IconPencil className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">Edit {post.title}</span>
                  </Link>
                  {post.published ? (
                    <Link
                      href={ROUTES.blogDetail(post.slug)}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "size-8 p-0 text-muted-foreground hover:text-foreground",
                      )}
                      title="View on site"
                    >
                      <IconExternalLink
                        className="size-3.5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">View {post.title} on site</span>
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 bg-muted/10 border-t border-border/50 text-right">
        <Link
          href={ROUTES.adminBlogs}
          className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
        >
          View all {totalPosts} posts
          <IconArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
