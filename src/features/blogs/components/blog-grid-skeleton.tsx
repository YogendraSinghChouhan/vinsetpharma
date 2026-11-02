import { Skeleton } from "@/components/ui/skeleton";

type BlogGridSkeletonProps = {
  count?: number;
};

const DEFAULT_SKELETON_ITEMS = [1, 2, 3, 4, 5, 6];

export function BlogGridSkeleton({ count = 6 }: BlogGridSkeletonProps) {
  const items =
    count === 6
      ? DEFAULT_SKELETON_ITEMS
      : Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((key) => (
        <div
          key={key}
          className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-xs"
        >
          <Skeleton className="aspect-16/9 w-full rounded-none" />
          <div className="flex flex-1 flex-col p-5 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-4/5" />
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
