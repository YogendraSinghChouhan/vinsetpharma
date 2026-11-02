import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_SKELETON_ITEMS = [
  "grid-skel-1",
  "grid-skel-2",
  "grid-skel-3",
  "grid-skel-4",
  "grid-skel-5",
  "grid-skel-6",
  "grid-skel-7",
  "grid-skel-8",
  "grid-skel-9",
  "grid-skel-10",
  "grid-skel-11",
  "grid-skel-12",
];

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  const items = DEFAULT_SKELETON_ITEMS.slice(0, count);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((id) => (
        <div
          key={id}
          className="flex flex-col overflow-hidden rounded-lg border bg-card"
        >
          <Skeleton className="aspect-4/3 w-full rounded-none" />
          <div className="flex flex-col p-5 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
