import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ITEMS = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

export function CategoryListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {SKELETON_ITEMS.map((itemKey) => (
        <div
          key={itemKey}
          className="flex items-center gap-3 border border-border bg-card p-3 shadow-xs"
        >
          <Skeleton className="size-4 shrink-0" />
          <Skeleton className="size-12 shrink-0" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="size-7" />
            <Skeleton className="size-7" />
          </div>
        </div>
      ))}
    </div>
  );
}
