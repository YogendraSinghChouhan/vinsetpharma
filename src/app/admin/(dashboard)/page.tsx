import { IconBox, IconExternalLink, IconPlus } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/config/site";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { DashboardBlogSnapshot } from "@/features/admin-shell/components/dashboard-blog-snapshot";
import { DashboardCatalogSnapshot } from "@/features/admin-shell/components/dashboard-catalog-snapshot";
import { DashboardQuickActions } from "@/features/admin-shell/components/dashboard-quick-actions";
import { DashboardRecentQuotes } from "@/features/admin-shell/components/dashboard-recent-quotes";
import { DashboardStats } from "@/features/admin-shell/components/dashboard-stats";
import { DashboardSystemOverview } from "@/features/admin-shell/components/dashboard-system-overview";
import { getAdminDashboardData } from "@/features/admin-shell/data";
import { getSession } from "@/features/auth/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

async function DashboardContent() {
  const [session, data] = await Promise.all([
    getSession(),
    getAdminDashboardData(),
  ]);

  const adminName = session?.user.name ?? "Administrator";
  const adminEmail = session?.user.email;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description={`Welcome back, ${adminName}. Here is your operations and content overview.`}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href={ROUTES.home}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "text-xs font-medium",
              )}
            >
              <IconExternalLink
                className="size-3.5 mr-1.5"
                aria-hidden="true"
              />
              Live Site
            </Link>
            <Link
              href={ROUTES.adminProductNew}
              className={cn(
                buttonVariants({ size: "sm" }),
                "text-xs font-medium",
              )}
            >
              <IconPlus className="size-3.5 mr-1" aria-hidden="true" />
              <IconBox className="size-3.5 mr-1.5" aria-hidden="true" />
              New Product
            </Link>
          </div>
        }
      />

      {/* Quick Action Shortcuts */}
      <DashboardQuickActions
        pendingQuotesCount={data.stats.quotes.new}
        heroSlidesCount={data.stats.hero.total}
        heroSlidesCapacity={data.stats.hero.capacity}
      />

      {/* Key Metric Overview Cards */}
      <DashboardStats stats={data.stats} system={data.system} />

      {/* Recent High-Priority Quote Inquiries */}
      <DashboardRecentQuotes
        quotes={data.recentQuotes}
        totalQuotes={data.stats.quotes.total}
        newQuotesCount={data.stats.quotes.new}
      />

      {/* Catalog & Content Side-by-Side Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardCatalogSnapshot
          products={data.recentProducts}
          totalProducts={data.stats.products.total}
        />
        <DashboardBlogSnapshot
          posts={data.recentPosts}
          totalPosts={data.stats.blogs.total}
        />
      </div>

      {/* System Infrastructure & Session Overview */}
      <DashboardSystemOverview
        system={data.system}
        adminName={adminName}
        adminEmail={adminEmail}
      />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2 pb-6 md:flex-row md:items-center md:justify-between border-b">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Quick actions skeleton */}
      <Skeleton className="h-14 w-full rounded-xl" />

      {/* 4 Stat Cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton placeholders
          <Card key={i} className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="size-9 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24 pt-3 border-t" />
          </Card>
        ))}
      </div>

      {/* Recent quotes table skeleton */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-7 w-20" />
        </div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton placeholders
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </Card>

      {/* 2-column breakdown skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5 space-y-4">
          <Skeleton className="h-5 w-36" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton placeholders
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
        <Card className="p-5 space-y-4">
          <Skeleton className="h-5 w-36" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton placeholders
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      </div>

      {/* System info skeleton */}
      <Card className="p-5 space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton placeholders
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
