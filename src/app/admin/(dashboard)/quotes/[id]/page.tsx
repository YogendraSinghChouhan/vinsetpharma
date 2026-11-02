import { IconArrowLeft } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/config/site";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { QuoteDetailSkeleton } from "@/features/quotes/components/quote-detail-skeleton";
import {
  EmailNotSentBadge,
  QuoteStatusBadge,
} from "@/features/quotes/components/quote-status-badge";
import { QuoteStatusControl } from "@/features/quotes/components/quote-status-control";
import { getQuoteRequestById } from "@/features/quotes/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Quote Enquiry Detail | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminQuoteDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function QuoteDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Validate uuid format
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) {
    notFound();
  }

  const quote = await getQuoteRequestById(parsedId.data);
  if (!quote) {
    notFound();
  }

  const hasActiveProduct = Boolean(quote.productSlug && quote.productPublished);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <Link
          href={ROUTES.adminQuotes}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          <IconArrowLeft className="size-4 mr-1.5" aria-hidden="true" />
          <span>Back to Quotes</span>
        </Link>

        <QuoteStatusControl quoteId={quote.id} initialStatus={quote.status} />
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-xs sm:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Contact Name */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact Name
            </span>
            <p className="mt-1 text-lg font-medium text-foreground">
              {quote.name}
            </p>
          </div>

          {/* Current Status */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current Status
            </span>
            <div className="mt-1 flex items-center gap-2">
              <QuoteStatusBadge status={quote.status} />
              {quote.emailSentAt ? null : <EmailNotSentBadge />}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address
            </span>
            <p className="mt-1 text-base">
              <a
                href={`mailto:${quote.email}`}
                className="font-medium text-primary hover:underline"
              >
                {quote.email}
              </a>
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Phone Number
            </span>
            <p className="mt-1 text-base">
              <a
                href={`tel:${quote.phone.replace(/\s+/g, "")}`}
                className="font-medium text-primary hover:underline"
              >
                {quote.phone}
              </a>
            </p>
          </div>

          {/* Referenced Product */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Requested Product
            </span>
            <p className="mt-1 text-base font-medium text-foreground">
              {hasActiveProduct && quote.productSlug ? (
                <Link
                  href={ROUTES.productDetail(quote.productSlug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {quote.productTitle} &nearr;
                </Link>
              ) : (
                <span>
                  {quote.productTitle}
                  <span className="ml-2 text-xs text-muted-foreground">
                    (Product unlisted or deleted)
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Submission Timestamp */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Submission Date
            </span>
            <p className="mt-1 font-mono text-sm text-foreground">
              {new Date(quote.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>

        {/* Message body */}
        <div className="mt-8 border-t pt-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Enquiry Message & Specifications
          </span>
          <div className="mt-3 rounded-md bg-muted/40 p-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
            {quote.message}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminQuoteDetailPage({
  params,
}: AdminQuoteDetailPageProps) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quote Request Details"
        description="Inspect enquiry details, prospective customer credentials, and commercial requirements."
      />

      <Suspense fallback={<QuoteDetailSkeleton />}>
        <QuoteDetailContent params={params} />
      </Suspense>
    </div>
  );
}
