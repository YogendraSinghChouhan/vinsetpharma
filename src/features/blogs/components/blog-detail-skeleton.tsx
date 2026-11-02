import { Skeleton } from "@/components/ui/skeleton";

export function BlogDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Breadcrumb skeleton */}
      <Skeleton className="h-4 w-48" />

      {/* Title & Date */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-4/5" />
      </div>

      {/* Cover image skeleton */}
      <Skeleton className="aspect-16/9 w-full rounded-xl" />

      {/* Body paragraphs skeleton */}
      <div className="space-y-4 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full pt-4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
