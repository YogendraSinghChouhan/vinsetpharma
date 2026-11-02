import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/config/site";
import { LoginForm } from "@/features/admin-auth/components/login-form";
import { getSession } from "@/features/auth/data";

function LoginFormSkeleton() {
  return (
    <Card className="w-full max-w-md border bg-card shadow-sm">
      <CardHeader className="space-y-1.5 text-center">
        <Skeleton className="mx-auto h-6 w-36" />
        <Skeleton className="mx-auto h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="mt-4 h-10 w-full" />
      </CardContent>
    </Card>
  );
}

async function LoginCheck() {
  const session = await getSession();
  if (session) {
    redirect(ROUTES.admin);
  }
  return <LoginForm />;
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginCheck />
      </Suspense>
    </div>
  );
}
