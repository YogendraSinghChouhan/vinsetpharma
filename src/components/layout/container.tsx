import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  size?: "wide" | "default" | "narrow";
};

export function Container({
  children,
  className,
  size = "wide",
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "wide" && "max-w-7xl",
        size === "default" && "max-w-6xl",
        size === "narrow" && "max-w-4xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
