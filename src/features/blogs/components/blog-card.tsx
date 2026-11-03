import { ROUTES } from "@/config/site";
import type { PublicPost } from "../public-data";
import { getPlainTextExcerpt } from "../sanitize";
import { BlogCardView, type BlogCardViewProps } from "./blog-card-view";

export { BlogCardView, type BlogCardViewProps };

export type BlogCardProps = {
  post: PublicPost;
  priority?: boolean;
};

export function BlogCard({ post, priority = false }: BlogCardProps) {
  const excerpt = getPlainTextExcerpt(post.content, 160);

  return (
    <BlogCardView
      href={ROUTES.blogDetail(post.slug)}
      title={post.title}
      excerpt={excerpt}
      coverImageKey={post.coverImageKey}
      publishedAt={post.publishedAt}
      priority={priority}
    />
  );
}
