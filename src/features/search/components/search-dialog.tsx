"use client";

import { IconLoader2, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { SearchResult } from "../data";

export function SearchDialog() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      setResults([]);
      setError("Enter at least 2 characters to search.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(normalizedQuery)}`,
      );
      const payload: { results?: SearchResult[]; error?: string } =
        await response.json();

      if (!response.ok || !payload.results) {
        setResults([]);
        setError(payload.error ?? "Unable to complete the search.");
        return;
      }

      setResults(payload.results);
    } catch {
      setResults([]);
      setError("Unable to complete the search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label="Search products and categories"
            className="rounded-full border-border/80"
          />
        }
      >
        <IconSearch className="size-4" aria-hidden="true" />
      </DialogTrigger>
      <DialogContent
        className="w-[calc(100%-1rem)] max-w-2xl gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-2xl sm:w-full sm:gap-6 sm:p-6"
        closeButtonClassName="-top-11 right-0 rounded-full border border-border/80 bg-card shadow-lg hover:bg-muted"
      >
        <DialogHeader>
          <DialogTitle className="pr-10 text-base sm:text-lg">
            Search products and categories
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Find published products and product categories.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="site-search" className="sr-only">
            Search products and categories
          </label>
          <input
            id="site-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products or categories..."
            minLength={2}
            maxLength={100}
            autoFocus
            className="h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
          <Button
            type="submit"
            className="w-full rounded-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <IconLoader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              "Search"
            )}
          </Button>
        </form>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {!isLoading && query.trim().length >= 2 && !error ? (
          results.length > 0 ? (
            <ul className="grid max-h-[min(20rem,38vh)] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {results.map((result) => (
                <li key={`${result.type}-${result.id}`}>
                  <Link
                    href={result.href}
                    className={cn(
                      "block rounded-xl border border-border/80 bg-background p-3 transition-colors hover:border-primary/40 hover:bg-muted/50 sm:p-4",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    )}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                      {result.type}
                    </span>
                    <span className="mt-1 block font-semibold text-foreground">
                      {result.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {result.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No products or categories found.
            </p>
          )
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
