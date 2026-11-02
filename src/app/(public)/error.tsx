"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/config/site";
import { cn } from "@/lib/utils";

export default function PublicError({
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
    <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl focus:outline-none"
      >
        Something went wrong
      </h1>
      <p className="mt-4 text-base text-muted-foreground">
        We encountered an unexpected error while loading this page. Please try
        again or return to our homepage.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Try again
        </button>
        <Link
          href={ROUTES.home}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}
