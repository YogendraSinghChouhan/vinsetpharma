import {
  IconArticle,
  IconBox,
  IconExternalLink,
  IconFileInvoice,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/config/site";
import { cn } from "@/lib/utils";

type DashboardQuickActionsProps = {
  pendingQuotesCount: number;
};

export function DashboardQuickActions({
  pendingQuotesCount,
}: DashboardQuickActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border/70 bg-card p-3 shadow-2xs">
      <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground px-2">
        Quick Actions:
      </span>

      <Link
        href={ROUTES.adminProductNew}
        className={cn(
          buttonVariants({ size: "sm" }),
          "h-9 text-xs font-medium",
        )}
      >
        <IconPlus className="size-3.5 mr-1.5" aria-hidden="true" />
        <IconBox className="size-3.5 mr-1" aria-hidden="true" />
        Add Product
      </Link>

      <Link
        href={ROUTES.adminBlogNew}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-9 text-xs font-medium hover:border-primary/40",
        )}
      >
        <IconPlus className="size-3.5 mr-1.5" aria-hidden="true" />
        <IconArticle className="size-3.5 mr-1" aria-hidden="true" />
        Write Post
      </Link>

      <Link
        href={ROUTES.adminQuotes}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-9 text-xs font-medium relative hover:border-primary/40",
        )}
      >
        <IconFileInvoice className="size-3.5 mr-1.5" aria-hidden="true" />
        Review Enquiries
        {pendingQuotesCount > 0 ? (
          <span className="ml-2 flex size-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
            {pendingQuotesCount}
          </span>
        ) : null}
      </Link>

      <div className="ml-auto">
        <Link
          href={ROUTES.home}
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-9 text-xs text-muted-foreground hover:text-foreground",
          )}
        >
          <IconExternalLink className="size-3.5 mr-1.5" aria-hidden="true" />
          View Live Website
        </Link>
      </div>
    </div>
  );
}
