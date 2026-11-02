import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ROUTES } from "@/config/site";

type QuotesAdminPaginationProps = {
  currentPage: number;
  totalPages: number;
};

function getPageHref(page: number): string {
  if (page <= 1) {
    return ROUTES.adminQuotes;
  }
  return `${ROUTES.adminQuotes}?page=${page}`;
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

export function QuotesAdminPagination({
  currentPage,
  totalPages,
}: QuotesAdminPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePages(currentPage, totalPages);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          {hasPrevious ? (
            <PaginationPrevious href={getPageHref(currentPage - 1)} />
          ) : (
            <PaginationPrevious
              href={getPageHref(1)}
              aria-disabled="true"
              tabIndex={-1}
              className="pointer-events-none opacity-40"
            />
          )}
        </PaginationItem>

        {pages.map((p, idx) => {
          if (p === "ellipsis") {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: pagination ellipsis items
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const isCurrent = p === currentPage;
          return (
            <PaginationItem key={p}>
              <PaginationLink
                href={getPageHref(p)}
                isActive={isCurrent}
                aria-label={`Go to page ${p}`}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          {hasNext ? (
            <PaginationNext href={getPageHref(currentPage + 1)} />
          ) : (
            <PaginationNext
              href={getPageHref(totalPages)}
              aria-disabled="true"
              tabIndex={-1}
              className="pointer-events-none opacity-40"
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
