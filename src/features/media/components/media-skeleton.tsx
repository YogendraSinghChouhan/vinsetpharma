import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ITEMS = [
  "sk-1",
  "sk-2",
  "sk-3",
  "sk-4",
  "sk-5",
  "sk-6",
  "sk-7",
  "sk-8",
  "sk-9",
  "sk-10",
];

export function MediaSkeleton() {
  return (
    <div className="space-y-6">
      {/* Upload area skeleton */}
      <div className="rounded-xl border border-dashed border-border/80 bg-card p-8 flex flex-col items-center justify-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Grid skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-64" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {SKELETON_ITEMS.map((key) => (
            <div
              key={key}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xs"
            >
              <Skeleton className="aspect-square w-full" />
              <div className="p-2 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <div className="flex justify-between items-center pt-1">
                  <Skeleton className="size-7 rounded-md" />
                  <Skeleton className="size-7 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
