import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ITEMS = [
  "skeleton-1",
  "skeleton-2",
  "skeleton-3",
  "skeleton-4",
  "skeleton-5",
  "skeleton-6",
];

export function ProductListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Summary chips bar skeleton */}
      <div className="flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Row cards skeleton */}
      <div className="flex flex-col gap-2.5">
        {SKELETON_ITEMS.map((itemKey) => (
          <div
            key={itemKey}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-xs"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Skeleton className="size-6 shrink-0 rounded" />
              <Skeleton className="size-12 shrink-0 rounded-md" />
              <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-36 sm:w-48" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-44 sm:w-64" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 shrink-0 pl-12 sm:pl-0">
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="h-5 w-9 rounded-full" />
              <Skeleton className="size-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-9 w-48 rounded-md" />
      </div>
    </div>
  );
}
