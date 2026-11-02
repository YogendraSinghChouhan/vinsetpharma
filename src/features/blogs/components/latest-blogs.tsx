import Link from "next/link";
import { SectionHeading } from "@/components/brand/section-heading";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/config/site";
import { HOME_LATEST_POSTS_LIMIT } from "../constants";
import { getLatestPosts } from "../public-data";
import { BlogGrid } from "./blog-grid";

export async function LatestBlogsSection() {
  const posts = await getLatestPosts(HOME_LATEST_POSTS_LIMIT);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="latest-blogs" className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-10">
          <SectionHeading
            title="Latest Articles & Insights"
            description="Read our latest pharmaceutical discoveries, industry perspectives, and scientific updates."
          />

          <BlogGrid posts={posts} />

          <div className="flex justify-center pt-2">
            <Link
              href={ROUTES.blog}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground shadow-2xs transition-colors hover:bg-muted/70 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Explore All Articles
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
