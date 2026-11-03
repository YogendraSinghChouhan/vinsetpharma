import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/config/site";
import { getImageUrl } from "@/features/storage/image-url";
import { cn } from "@/lib/utils";

export type BlogCardViewProps = {
  href?: string;
  title: string;
  excerpt: string;
  coverImageKey: string | null;
  publishedAt?: Date | string | null;
  priority?: boolean;
  className?: string;
};

/**
 * Presentational blog card view shared between the public BlogCard
 * (as a link) and the admin blog post form preview (as a non-link container).
 */
export function BlogCardView({
  href,
  title,
  excerpt,
  coverImageKey,
  publishedAt,
  priority = false,
  className,
}: BlogCardViewProps) {
  let imageUrl: string | null = null;
  if (coverImageKey) {
    try {
      imageUrl = getImageUrl(coverImageKey);
    } catch {
      imageUrl = null;
    }
  }

  const dateObj = publishedAt ? new Date(publishedAt) : null;
  const formattedDate = dateObj
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(dateObj)
    : "";

  const isoDate = dateObj ? dateObj.toISOString() : undefined;

  const content = (
    <>
      <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-surface-tint border border-border/60">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title || "Blog cover"}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-opacity group-hover:opacity-95"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-tint text-muted-foreground text-sm font-medium">
            {SITE_NAME}
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
        ) : (
          <span className="text-xs font-medium text-muted-foreground/60 italic">
            Draft — not yet published
          </span>
        )}

        <h3 className="mt-2 font-heading text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
          {title || "Untitled Article"}
        </h3>

        {excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {excerpt}
          </p>
        ) : (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground/60 italic">
            Article excerpt will appear here.
          </p>
        )}
      </div>
    </>
  );

  const containerClasses = cn(
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-4 transition-colors duration-200 shadow-2xs",
    href
      ? "hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      : "cursor-default",
    className,
  );

  if (href) {
    return (
      <Link href={href} aria-label={title} className={containerClasses}>
        {content}
      </Link>
    );
  }

  return <div className={containerClasses}>{content}</div>;
}
