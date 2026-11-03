import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ROUTES, SITE_NAME } from "@/config/site";
import { PageHeader } from "@/features/marketing/components/page-header";
import {
  MediaGallery,
  type MediaGalleryItem,
} from "@/features/media/components/media-gallery";
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
  const galleryItems: MediaGalleryItem[] = items.map((item) => ({
    id: item.id,
    type: item.type,
    fileUrl: getImageUrl(item.fileKey),
    posterUrl: item.posterKey ? getImageUrl(item.posterKey) : undefined,
    width: item.width,
    height: item.height,
    caption: item.caption,
  }));

  return (
    <>
      <PageHeader
        title="Media Gallery"
        description={`Explore photos and videos from ${SITE_NAME}'s pharmaceutical operations, facilities, and products.`}
        crumbs={[{ label: "Home", href: ROUTES.home }, { label: "Media" }]}
      />
      <Container className="py-12 sm:py-16 lg:py-20">
        {galleryItems.length > 0 ? (
          <MediaGallery items={galleryItems} />
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
