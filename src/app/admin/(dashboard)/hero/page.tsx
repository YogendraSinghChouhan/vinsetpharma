import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/config/site";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { HeroManager } from "@/features/hero/components/hero-manager";
import { HeroSkeleton } from "@/features/hero/components/hero-skeleton";
import { listHeroSlides } from "@/features/hero/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hero Banner | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

async function HeroContent() {
  const items = await listHeroSlides();
  return <HeroManager initialItems={items} />;
}

export default function AdminHeroPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Hero banner"
        description="Upload wide landscape photos, arrange their order, and set focus alignment for the home page slideshow."
        actions={
          <Link
            href={ROUTES.home}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "min-h-[44px] rounded-full px-4",
            )}
          >
            View home page
          </Link>
        }
      />
      <Suspense fallback={<HeroSkeleton />}>
        <HeroContent />
      </Suspense>
    </div>
  );
}
