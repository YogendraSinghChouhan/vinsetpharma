import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { formatShowingText, getAdminPageHref } from "../pagination-utils";

export interface AdminPaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

function getVisiblePages(
  current: number,
  total: number,
): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", total];
  }

  if (current >= total - 3) {
    return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

export function AdminPagination({
  page,
  totalPages,
  basePath,
  totalItems,
  pageSize = 20,
  className,
}: AdminPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePages(page, totalPages);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  const showingText =
    totalItems !== undefined
      ? formatShowingText({ page, pageSize, totalItems })
      : null;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-muted-foreground",
        className,
      )}
    >
      {showingText && (
        <p className="order-2 sm:order-1 text-center sm:text-left select-none">
          {showingText}
        </p>
      )}

      <Pagination
        className={cn(
          "order-1 sm:order-2 w-auto mx-0",
          !showingText && "mx-auto",
        )}
      >
        <PaginationContent className="gap-1">
          <PaginationItem>
            {hasPrevious ? (
              <PaginationPrevious
                href={getAdminPageHref(basePath, page - 1)}
                className="min-h-[44px] min-w-[44px] px-3 justify-center"
              />
            ) : (
              <PaginationPrevious
                href={getAdminPageHref(basePath, 1)}
                aria-disabled="true"
                tabIndex={-1}
                className="pointer-events-none opacity-40 min-h-[44px] min-w-[44px] px-3 justify-center"
              />
            )}
          </PaginationItem>

          {pages.map((p, idx) => {
            if (p === "ellipsis") {
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: pagination ellipsis separator
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis className="min-h-[44px] min-w-[44px]" />
                </PaginationItem>
              );
            }

            const isCurrent = p === page;
            return (
              <PaginationItem key={p}>
                <PaginationLink
                  href={getAdminPageHref(basePath, p)}
                  isActive={isCurrent}
                  aria-label={`Go to page ${p}`}
                  className="min-h-[44px] min-w-[44px]"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            {hasNext ? (
              <PaginationNext
                href={getAdminPageHref(basePath, page + 1)}
                className="min-h-[44px] min-w-[44px] px-3 justify-center"
              />
            ) : (
              <PaginationNext
                href={getAdminPageHref(basePath, totalPages)}
                aria-disabled="true"
                tabIndex={-1}
                className="pointer-events-none opacity-40 min-h-[44px] min-w-[44px] px-3 justify-center"
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
