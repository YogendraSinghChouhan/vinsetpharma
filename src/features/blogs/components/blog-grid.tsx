import { cn } from "@/lib/utils";
import type { PublicPost } from "../public-data";
import { BlogCard } from "./blog-card";

type BlogGridProps = {
  posts: PublicPost[];
  className?: string;
};

export function BlogGrid({ posts, className }: BlogGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {posts.map((post, index) => (
        <BlogCard key={post.id} post={post} priority={index < 3} />
      ))}
    </div>
  );
}
