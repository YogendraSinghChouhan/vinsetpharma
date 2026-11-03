import { IconPlayerPlay } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { BlisterPocket } from "@/components/brand/blister-pocket";
import { SectionHeading } from "@/components/brand/section-heading";
import { AutoCarousel } from "@/components/carousel/auto-carousel";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/config/site";
import { getImageUrl } from "@/features/storage/image-url";
import { MEDIA_CAROUSEL_LIMIT } from "../constants";
import { getTopMedia, type PublicMediaItem } from "../public-data";

function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return "";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getSlideAccessibleName(
  item: PublicMediaItem,
  index: number,
  total: number,
): string {
  const isVideo = item.type === "video";
  const typeLabel = isVideo ? "Video" : "Photo";
  if (item.caption && item.caption.trim().length > 0) {
    return `${typeLabel}: ${item.caption.trim()}`;
  }
  return `${typeLabel} ${index + 1} of ${total}`;
}

export async function MediaCarouselSection() {
  const items = await getTopMedia(MEDIA_CAROUSEL_LIMIT);

  if (!items || items.length === 0) {
    return null;
  }

  const total = items.length;

  return (
    <section
      id="media-gallery"
      className="py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      <Container>
        <div className="flex flex-col gap-8 sm:gap-10">
          <SectionHeading
            title="Media gallery"
            description="A visual look into our pharmaceutical products, packaging, and facilities."
          />

          <AutoCarousel
            ariaLabel="Media gallery showcase"
            slideClassName="w-[82%] md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
            gapClassName="gap-4 sm:gap-6"
          >
            {items.map((item, index) => {
              const imageKey =
                item.type === "video" && item.posterKey
                  ? item.posterKey
                  : item.fileKey;
              const imageUrl = getImageUrl(imageKey);
              const accessibleName = getSlideAccessibleName(item, index, total);
              const isVideo = item.type === "video";

              return (
                <Link
                  key={item.id}
                  href={ROUTES.media}
                  aria-label={accessibleName}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-3 sm:p-4 shadow-2xs transition-colors duration-200 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <BlisterPocket
                    depth="subtle"
                    interactive
                    className="relative aspect-4/3 w-full overflow-hidden rounded-xl"
                  >
                    <Image
                      src={imageUrl}
                      alt={item.caption || `${item.type} media`}
                      fill
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Video Indicators (Play Button + Duration Badge) */}
                    {isVideo ? (
                      <>
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="flex size-12 items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur-xs transition-transform duration-200 group-hover:scale-110">
                            <IconPlayerPlay
                              className="size-6 ml-0.5"
                              aria-hidden="true"
                            />
                          </div>
                        </div>

                        {item.durationSeconds ? (
                          <div className="pointer-events-none absolute top-3 right-3 rounded-md bg-black/75 px-2 py-0.5 font-mono text-[11px] font-medium text-white shadow-xs backdrop-blur-xs">
                            {formatDuration(item.durationSeconds)}
                          </div>
                        ) : null}
                      </>
                    ) : null}

                    {/* AA-Legible Caption Scrim Overlay */}
                    {item.caption ? (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 sm:p-4 pt-10">
                        <p className="line-clamp-2 text-xs sm:text-sm font-medium text-white drop-shadow-xs leading-snug">
                          {item.caption}
                        </p>
                      </div>
                    ) : null}
                  </BlisterPocket>
                </Link>
              );
            })}
          </AutoCarousel>

          <div className="flex justify-center pt-2">
            <Link
              href={ROUTES.media}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground shadow-2xs transition-colors hover:bg-muted/70 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Explore photo gallery
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
