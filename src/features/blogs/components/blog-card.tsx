import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/site";
import { getImageUrl } from "@/features/storage/image-url";
import type { PublicPost } from "../public-data";
import { getPlainTextExcerpt } from "../sanitize";

type BlogCardProps = {
  post: PublicPost;
  priority?: boolean;
};

export function BlogCard({ post, priority = false }: BlogCardProps) {
  const imageUrl = getImageUrl(post.coverImageKey);
  const excerpt = getPlainTextExcerpt(post.content, 160);

  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(post.publishedAt))
    : "";

  const isoDate = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : undefined;

  return (
    <Link
      href={ROUTES.blogDetail(post.slug)}
      aria-label={post.title}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-4 transition-colors duration-200 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-2xs"
    >
      <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-surface-tint border border-border/60">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-opacity group-hover:opacity-95"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-tint text-muted-foreground text-sm font-medium">
            vinset Pharma
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4 px-1 pb-1">
        {formattedDate && isoDate ? (
          <time
            dateTime={isoDate}
            className="text-xs font-medium text-muted-foreground"
          >
            {formattedDate}
          </time>
        ) : null}

        <h3 className="mt-2 font-heading text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
          {post.title}
        </h3>

        {excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {excerpt}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
