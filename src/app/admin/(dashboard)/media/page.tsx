import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { MediaManager } from "@/features/media/components/media-manager";
import { MediaSkeleton } from "@/features/media/components/media-skeleton";
import { listMedia } from "@/features/media/data";

export const metadata: Metadata = {
  title: "Media | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

async function MediaContent() {
  const items = await listMedia();
  return <MediaManager initialItems={items} />;
}

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media"
        description="Upload photos and videos, arrange them by drag and drop, and manage captions."
      />
      <Suspense fallback={<MediaSkeleton />}>
        <MediaContent />
      </Suspense>
    </div>
  );
}
