import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminCreatePageLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function AdminCreatePageLayout({
  children,
  className,
}: AdminCreatePageLayoutProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1600px] space-y-6", className)}>
      {children}
    </div>
  );
}
