import Link from "next/link";
import { SectionHeading } from "@/components/brand/section-heading";
import { Container } from "@/components/layout/container";
import { CarouselItem } from "@/components/ui/carousel";
import { ROUTES } from "@/config/site";
import { HOME_LATEST_POSTS_LIMIT } from "../constants";
import { getLatestPosts } from "../public-data";
import { BlogCard } from "./blog-card";
import { BlogCarousel } from "./blog-carousel";

export async function LatestBlogsSection() {
  const posts = await getLatestPosts(HOME_LATEST_POSTS_LIMIT);

  if (posts.length === 0) {
    return null;
  }

  // Ensure sufficient slides for seamless infinite loop
  const displayPosts =
    posts.length > 0 && posts.length < 6 ? [...posts, ...posts] : posts;

  return (
    <section
      id="latest-blogs"
      className="py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      <Container>
        <div className="flex flex-col gap-10">
          <SectionHeading
            title="Latest Articles & Insights"
            description="Read our latest pharmaceutical discoveries, industry perspectives, and scientific updates."
          />

          <BlogCarousel>
            {displayPosts.map((post, index) => (
              <CarouselItem
                key={`${post.id}-${index}`}
                className="pl-4 sm:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <div className="h-full">
                  <BlogCard post={post} priority={index < 3} />
                </div>
              </CarouselItem>
            ))}
          </BlogCarousel>

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
