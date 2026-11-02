import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BlisterPocketProps = {
  children: ReactNode;
  className?: string;
  depth?: "subtle" | "deep";
  interactive?: boolean;
};

/**
 * BlisterPocket: A tactile recessed well inspired by pharmaceutical blister cavities.
 * Provides a softly tinted, inset-bevel surface designed to showcase products or
 * feature content cleanly without optical clutter.
 */
export function BlisterPocket({
  children,
  className,
  depth = "subtle",
  interactive = false,
}: BlisterPocketProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-surface-tint border border-border/80",
        depth === "subtle" &&
          "shadow-[inset_0_2px_4px_rgba(4,67,83,0.04),inset_0_-1px_2px_rgba(255,255,255,0.7)]",
        depth === "deep" &&
          "shadow-[inset_0_3px_8px_rgba(4,67,83,0.08),inset_0_-2px_4px_rgba(255,255,255,0.9)]",
        interactive &&
          "transition-colors duration-200 group-hover:border-primary/40 group-hover:bg-surface-tint/80",
        className,
      )}
    >
      {children}
    </div>
  );
}
