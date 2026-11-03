import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ROUTES, SITE_NAME } from "@/config/site";
import { PageHeader } from "@/features/marketing/components/page-header";
import { MEDIA_MAX_ITEMS } from "@/features/media/constants";
import { getTopMedia } from "@/features/media/public-data";
import { getImageUrl } from "@/features/storage/image-url";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Media Gallery",
  description: `Explore photos and videos from ${SITE_NAME}'s pharmaceutical operations, facilities, and products.`,
  path: ROUTES.media,
});

export default async function MediaPage() {
  const items = await getTopMedia(MEDIA_MAX_ITEMS);

  return (
    <>
      <PageHeader
        title="Media Gallery"
        description={`Explore photos and videos from ${SITE_NAME}'s pharmaceutical operations, facilities, and products.`}
        crumbs={[{ label: "Home", href: ROUTES.home }, { label: "Media" }]}
      />
      <Container className="py-12 sm:py-16 lg:py-20">
        {items.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const posterUrl = item.posterKey
                ? getImageUrl(item.posterKey)
                : undefined;

              return (
                <figure
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs"
                >
                  {item.type === "video" ? (
                    <video
                      className="aspect-4/3 w-full bg-muted object-cover"
                      controls
                      preload="metadata"
                      poster={posterUrl}
                    >
                      <source src={getImageUrl(item.fileKey)} />
                      <track kind="captions" />
                      Your browser does not support video playback.
                    </video>
                  ) : (
                    <Image
                      src={getImageUrl(item.fileKey)}
                      alt={item.caption || "Vinset Pharma media"}
                      width={item.width}
                      height={item.height}
                      className="aspect-4/3 w-full object-cover"
                    />
                  )}
                  {item.caption ? (
                    <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                      {item.caption}
                    </figcaption>
                  ) : null}
                </figure>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">Media will be published soon.</p>
            <p className="mt-2 text-sm">
              Please check back later for photos and videos from our
              pharmaceutical operations.
            </p>
          </div>
        )}
      </Container>
    </>
  );
}
