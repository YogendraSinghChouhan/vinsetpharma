import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/config/site";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { QuoteListSkeleton } from "@/features/quotes/components/quote-list-skeleton";
import {
  EmailNotSentBadge,
  QuoteStatusBadge,
} from "@/features/quotes/components/quote-status-badge";
import { QuotesAdminPagination } from "@/features/quotes/components/quotes-admin-pagination";
import { ADMIN_QUOTES_PAGE_SIZE } from "@/features/quotes/constants";
import { listQuoteRequests } from "@/features/quotes/data";

export const metadata: Metadata = {
  title: "Quote Requests | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminQuotesPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function parsePageParam(rawPage: string | string[] | undefined): number {
  const value = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const result = z.coerce.number().int().positive().safeParse(value);
  return result.success ? result.data : 1;
}

async function QuotesContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = parsePageParam(resolvedParams.page);

  const { items, totalItems, totalPages } = await listQuoteRequests({
    page,
    pageSize: ADMIN_QUOTES_PAGE_SIZE,
  });

  if (totalItems === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card p-12 text-center text-muted-foreground">
        <p className="text-base font-medium">No quote requests received yet.</p>
        <p className="mt-1 text-sm">
          Incoming enquiries submitted from product pages will be listed here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-36">Submitted</TableHead>
              <TableHead>Contact Name</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-28 text-center">Status</TableHead>
              <TableHead className="w-32 text-center">Notification</TableHead>
              <TableHead className="w-20 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(quote.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  <Link
                    href={ROUTES.adminQuoteDetail(quote.id)}
                    className="hover:underline"
                  >
                    {quote.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {quote.productTitle}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {quote.email}
                </TableCell>
                <TableCell className="text-center">
                  <QuoteStatusBadge status={quote.status} />
                </TableCell>
                <TableCell className="text-center">
                  {quote.emailSentAt ? (
                    <span className="text-xs text-muted-foreground">Sent</span>
                  ) : (
                    <EmailNotSentBadge />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={ROUTES.adminQuoteDetail(quote.id)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <QuotesAdminPagination currentPage={page} totalPages={totalPages} />
    </>
  );
}

export default function AdminQuotesPage({
  searchParams,
}: AdminQuotesPageProps) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quote Requests"
        description="Review visitor enquiries submitted from product showcase pages."
      />

      <Suspense fallback={<QuoteListSkeleton />}>
        <QuotesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
