"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { setQuoteStatusAction } from "../actions";
import { QUOTE_STATUSES, type QuoteStatus } from "../constants";

type QuoteStatusControlProps = {
  quoteId: string;
  initialStatus: QuoteStatus;
};

export function QuoteStatusControl({
  quoteId,
  initialStatus,
}: QuoteStatusControlProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] =
    useState<QuoteStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: QuoteStatus) => {
    if (newStatus === currentStatus || isPending) {
      return;
    }

    const previousStatus = currentStatus;
    // Optimistic UI update
    setCurrentStatus(newStatus);

    startTransition(async () => {
      const result = await setQuoteStatusAction({
        id: quoteId,
        status: newStatus,
      });

      if (!result.success) {
        // Rollback state on error
        setCurrentStatus(previousStatus);
        toast.add({
          title: "Status update failed",
          description: result.error,
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Status updated",
        description: `Quote request marked as ${newStatus}.`,
        type: "success",
      });
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Review Status:
      </span>
      <div className="inline-flex rounded-lg border bg-muted/40 p-0.5">
        {QUOTE_STATUSES.map((status) => {
          const isActive = currentStatus === status;
          return (
            <Button
              key={status}
              type="button"
              variant={isActive ? "default" : "ghost"}
              size="sm"
              disabled={isPending}
              onClick={() => handleStatusChange(status)}
              className="h-8 px-3 text-xs capitalize font-medium"
            >
              {status}
            </Button>
          );
        })}
      </div>
      {isPending ? <Spinner className="size-4 text-muted-foreground" /> : null}
    </div>
  );
}
