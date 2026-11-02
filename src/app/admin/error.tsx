"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/config/site";
import { cn } from "@/lib/utils";

export default function AdminError({
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl focus:outline-none"
      >
        Admin system error
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        An unexpected error occurred while processing this request. Please try
        again or return to the dashboard overview.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Try again
        </button>
        <Link
          href={ROUTES.admin}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
