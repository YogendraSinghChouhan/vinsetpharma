import { Skeleton } from "@/components/ui/skeleton";

export function AdminShellSkeleton() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="w-64 border-r p-4 hidden md:flex flex-col gap-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2 mt-4">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="mt-auto space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b flex items-center px-6">
          <Skeleton className="h-6 w-24" />
        </header>
        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div className="space-y-2 pb-6 border-b">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="grid gap-4">
            <Skeleton className="h-28 w-full" />
          </div>
        </main>
      </div>
    </div>
  );
}
