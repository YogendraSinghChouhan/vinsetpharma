import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <section
      className="space-y-8"
      aria-busy="true"
      aria-label="Loading hero banner slides"
    >
      {/* Guidance and Uploader Skeleton */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-32 w-full rounded-xl border border-dashed border-border/60" />
      </div>

      {/* Slide Cards Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>

        <div className="space-y-4">
          {[1, 2].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-28 rounded-md" />
                <Skeleton className="size-8 rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 flex gap-4">
                  <Skeleton className="aspect-video flex-1 rounded-xl" />
                  <Skeleton className="w-20 aspect-[9/16] rounded-xl" />
                </div>
                <div className="md:col-span-5 space-y-4">
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-8 w-48 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
