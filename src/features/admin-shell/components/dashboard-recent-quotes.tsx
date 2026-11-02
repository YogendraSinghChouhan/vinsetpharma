import {
  IconArrowRight,
  IconFileInvoice,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/config/site";
import {
  EmailNotSentBadge,
  QuoteStatusBadge,
} from "@/features/quotes/components/quote-status-badge";
import { cn } from "@/lib/utils";
import type { DashboardRecentQuote } from "../data";

type DashboardRecentQuotesProps = {
  quotes: DashboardRecentQuote[];
  totalQuotes: number;
  newQuotesCount: number;
};

export function DashboardRecentQuotes({
  quotes,
  totalQuotes,
  newQuotesCount,
}: DashboardRecentQuotesProps) {
  return (
    <Card className="border border-border/70 shadow-2xs overflow-hidden">
      <div className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 bg-muted/20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">
              Recent Quote Requests
            </h2>
            {newQuotesCount > 0 ? (
              <Badge className="border-amber-300/80 bg-amber-50 px-2 py-0.5 text-xs text-amber-800 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-300">
                {newQuotesCount} new
              </Badge>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Latest inquiries submitted by healthcare providers and procurement
            teams.
          </p>
        </div>

        <Link
          href={ROUTES.adminQuotes}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-8 text-xs font-medium text-primary hover:text-primary",
          )}
        >
          View all ({totalQuotes})
          <IconArrowRight className="size-3.5 ml-1" aria-hidden="true" />
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
            <IconFileInvoice className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">
            No quote requests yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            When visitors request quotations from your product pages, their
            inquiries will appear here immediately.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-28 text-xs">Date</TableHead>
                <TableHead className="text-xs">Client Name</TableHead>
                <TableHead className="text-xs">Requested Product</TableHead>
                <TableHead className="text-xs">Contact Info</TableHead>
                <TableHead className="w-24 text-center text-xs">
                  Status
                </TableHead>
                <TableHead className="w-28 text-center text-xs">
                  Alert
                </TableHead>
                <TableHead className="w-20 text-right text-xs">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow
                  key={quote.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(quote.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={ROUTES.adminQuoteDetail(quote.id)}
                      className="font-medium text-foreground hover:text-primary hover:underline text-xs"
                    >
                      {quote.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">
                    {quote.productTitle}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex flex-col gap-0.5">
                      <a
                        href={`mailto:${quote.email}`}
                        className="inline-flex items-center gap-1 hover:text-primary transition-colors truncate max-w-[170px]"
                        title={quote.email}
                      >
                        <IconMail
                          className="size-3 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="truncate">{quote.email}</span>
                      </a>
                      {quote.phone ? (
                        <a
                          href={`tel:${quote.phone}`}
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/80 hover:text-primary transition-colors"
                        >
                          <IconPhone
                            className="size-3 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{quote.phone}</span>
                        </a>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <QuoteStatusBadge
                      status={quote.status}
                      className="text-[11px]"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {quote.emailSentAt ? (
                      <span className="text-[11px] text-muted-foreground">
                        Sent
                      </span>
                    ) : (
                      <EmailNotSentBadge className="text-[10px]" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={ROUTES.adminQuoteDetail(quote.id)}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "h-7 px-2 text-xs font-semibold text-primary hover:text-primary",
                      )}
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
