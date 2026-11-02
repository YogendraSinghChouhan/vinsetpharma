import {
  IconArrowRight,
  IconArticle,
  IconBox,
  IconCircleCheck,
  IconFileInvoice,
  IconServer,
} from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/config/site";
import type { AdminDashboardStats, DashboardSystemInfo } from "../data";

type DashboardStatsProps = {
  stats: AdminDashboardStats;
  system: DashboardSystemInfo;
};

export function DashboardStats({ stats, system }: DashboardStatsProps) {
  const publishedProductsPct =
    stats.products.total > 0
      ? Math.round((stats.products.published / stats.products.total) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Quote Requests */}
      <Card className="flex flex-col justify-between p-5 border border-border/70 shadow-2xs hover:border-primary/30 transition-colors">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Quote Inquiries
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <IconFileInvoice className="size-5" aria-hidden="true" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.quotes.total}
            </div>
            <div className="mt-2 flex items-center gap-2">
              {stats.quotes.new > 0 ? (
                <Badge className="border-amber-300/80 bg-amber-50 px-2 py-0.5 text-xs text-amber-800 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-300">
                  {stats.quotes.new} new
                </Badge>
              ) : (
                <Badge className="border-emerald-300/80 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                  All handled
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {stats.quotes.last7Days} in last 7 days
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border/50">
          <Link
            href={ROUTES.adminQuotes}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Manage inquiries
            <IconArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </Card>

      {/* 2. Product Catalog */}
      <Card className="flex flex-col justify-between p-5 border border-border/70 shadow-2xs hover:border-primary/30 transition-colors">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Product Catalog
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IconBox className="size-5" aria-hidden="true" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.products.total}
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  <strong className="text-foreground">
                    {stats.products.published}
                  </strong>{" "}
                  live
                </span>
                <span>
                  <strong className="text-foreground">
                    {stats.products.draft}
                  </strong>{" "}
                  drafts
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${publishedProductsPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border/50">
          <Link
            href={ROUTES.adminProducts}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Manage catalog
            <IconArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </Card>

      {/* 3. Blog & Editorial */}
      <Card className="flex flex-col justify-between p-5 border border-border/70 shadow-2xs hover:border-primary/30 transition-colors">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Blog & Articles
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <IconArticle className="size-5" aria-hidden="true" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.blogs.total}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge className="border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {stats.blogs.published} published
              </Badge>
              <span className="text-xs text-muted-foreground">
                {stats.blogs.draft} drafts
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border/50">
          <Link
            href={ROUTES.adminBlogs}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Manage articles
            <IconArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </Card>

      {/* 4. Infrastructure Health */}
      <Card className="flex flex-col justify-between p-5 border border-border/70 shadow-2xs hover:border-primary/30 transition-colors">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              System & Storage
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <IconServer className="size-5" aria-hidden="true" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Healthy
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
              <IconCircleCheck className="size-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Postgres & S3 connected</span>
            </div>
            <p className="mt-0.5 truncate text-[11px] font-mono text-muted-foreground/80">
              {system.storageBucket}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border/50">
          <a
            href="#system-overview"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            System details
            <IconArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </Card>
    </div>
  );
}
