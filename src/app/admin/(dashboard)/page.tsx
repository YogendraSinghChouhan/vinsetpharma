import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { getSession } from "@/features/auth/data";

async function DashboardContent() {
  const session = await getSession();
  const adminName = session?.user.name ?? "Administrator";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description={`Welcome back, ${adminName}.`}
      />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 pb-6 border-b">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
