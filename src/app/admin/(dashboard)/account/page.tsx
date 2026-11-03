import type { Metadata } from "next";
import { AdminCreatePageLayout } from "@/features/admin-shell/components/admin-create-page-layout";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";

export const metadata: Metadata = {
  title: "Account | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAccountPage() {
  return (
    <AdminCreatePageLayout>
      <AdminPageHeader
        title="Account settings"
        description="Manage your admin account security."
      />
      <div className="mx-auto w-full max-w-3xl">
        <ChangePasswordForm />
      </div>
    </AdminCreatePageLayout>
  );
}
