"use client";

import { useEffect, useRef } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center p-6 font-sans text-slate-800 bg-slate-50">
        <div className="max-w-md text-center">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl focus:outline-none"
          >
            Application error
          </h1>
          <p className="mt-4 text-sm text-slate-600 sm:text-base">
            An unexpected error occurred. Please try again.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center rounded-md bg-[#004f66] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#003d4f] focus:outline-none focus:ring-2 focus:ring-[#004f66] focus:ring-offset-2"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
