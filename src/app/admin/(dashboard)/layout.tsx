import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toast";
import { ROUTES } from "@/config/site";
import { AdminShellSkeleton } from "@/features/admin-shell/components/admin-shell-skeleton";
import { AdminSidebar } from "@/features/admin-shell/components/admin-sidebar";
import { getSession } from "@/features/auth/data";

// NOTE: Real authorization is strictly enforced by calling requireAdmin()
// inside every future data operation and server action. This layout-level
// session check serves as a UX layer to prevent rendering the admin shell
// for unauthenticated users.
async function ProtectedAdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect(ROUTES.adminLogin);
  }

  return (
    <SidebarProvider>
      <AdminSidebar session={session} />
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger aria-label="Toggle navigation menu" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <a
            href={ROUTES.home}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            View website
          </a>
        </header>
        <main id="main-content" className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AdminShellSkeleton />}>
      <ProtectedAdminShell>{children}</ProtectedAdminShell>
    </Suspense>
  );
}
