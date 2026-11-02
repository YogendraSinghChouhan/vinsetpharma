import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { QuoteStatus } from "../constants";

type QuoteStatusBadgeProps = {
  status: QuoteStatus;
  className?: string;
};

export function QuoteStatusBadge({ status, className }: QuoteStatusBadgeProps) {
  if (status === "new") {
    return (
      <Badge
        className={cn(
          "border border-amber-300/80 bg-amber-50 px-2 py-0.5 text-amber-800 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-300",
          className,
        )}
      >
        New
      </Badge>
    );
  }

  return (
    <Badge
      className={cn(
        "border border-emerald-300/80 bg-emerald-50 px-2 py-0.5 text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-300",
        className,
      )}
    >
      Contacted
    </Badge>
  );
}

export function EmailNotSentBadge({ className }: { className?: string }) {
  return (
    <Badge
      className={cn(
        "border border-rose-300/80 bg-rose-50 px-2 py-0.5 text-rose-800 dark:border-rose-700/60 dark:bg-rose-950/40 dark:text-rose-300",
        className,
      )}
    >
      Email not sent
    </Badge>
  );
}
