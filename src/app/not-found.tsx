import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { ROUTES } from "@/config/site";

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          The page you are looking for does not exist or may have been moved.
          Visit the home page to explore vinset Pharma.
        </p>
        <Link
          href={ROUTES.home}
          className="text-sm font-medium text-primary underline underline-offset-4 hover:underline"
        >
          Return to the home page
        </Link>
      </div>
    </PublicLayout>
  );
}
