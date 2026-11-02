import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  description?: string | ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
};

/**
 * SectionHeading: Typographic section anchor for the Blister Pack design system.
 * Deliberately excludes generic tells (no all-caps eyebrows, no gimmicky single-word color highlights).
 * Enforces comfortable reading line length under 68 characters.
 */
export function SectionHeading({
  title,
  description,
  align = "left",
  dark = false,
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isCenter ? "items-center text-center mx-auto" : "items-start text-left",
        className,
      )}
    >
      <h2
        className={cn(
          "font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight",
          dark ? "text-brand-dark-foreground" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "text-base sm:text-lg leading-relaxed max-w-[65ch]",
            dark ? "text-brand-dark-muted" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
