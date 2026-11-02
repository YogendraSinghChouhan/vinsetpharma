import { cn } from "@/lib/utils";

type PerforationDividerProps = {
  className?: string;
  variant?: "light" | "dark" | "transition-to-dark";
};

/**
 * PerforationDivider: Structural divider inspired by pharmaceutical blister foil tear strips.
 * Features a fine dashed hairline punctuated by precision punch notches.
 * Used with restraint between major architectural sections and at footer transitions.
 */
export function PerforationDivider({
  className,
  variant = "light",
}: PerforationDividerProps) {
  if (variant === "transition-to-dark") {
    return (
      <div
        aria-hidden="true"
        className={cn("relative w-full h-4 overflow-hidden -mb-px", className)}
      >
        <svg
          viewBox="0 0 1200 16"
          preserveAspectRatio="none"
          className="w-full h-full fill-brand-dark"
          aria-hidden="true"
        >
          <title>Blister foil perforation transition</title>
          {/* Repeating scalloped blister foil punch notch edge */}
          <pattern
            id="perforationNotches"
            x="0"
            y="0"
            width="40"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 0 16 L 15 16 C 15 10 25 10 25 16 L 40 16 L 40 0 L 0 0 Z" />
          </pattern>
          <rect width="1200" height="16" fill="url(#perforationNotches)" />
        </svg>
      </div>
    );
  }

  const isDark = variant === "dark";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative w-full flex items-center justify-center my-6 sm:my-10 select-none",
        className,
      )}
    >
      {/* Dashed perforation hairline */}
      <div
        className={cn(
          "w-full h-px border-t border-dashed",
          isDark ? "border-[oklch(1_0_0/20%)]" : "border-border",
        )}
      />

      {/* Symmetric blister pack circular perforation punch notches */}
      <div className="absolute inset-x-0 flex items-center justify-between px-6 sm:px-12 pointer-events-none">
        <span
          className={cn(
            "size-2.5 rounded-full border shrink-0",
            isDark
              ? "border-[oklch(1_0_0/25%)] bg-brand-dark"
              : "border-border bg-background",
          )}
        />
        <span
          className={cn(
            "size-2.5 rounded-full border shrink-0 hidden md:block",
            isDark
              ? "border-[oklch(1_0_0/25%)] bg-brand-dark"
              : "border-border bg-background",
          )}
        />
        <span
          className={cn(
            "size-2.5 rounded-full border shrink-0",
            isDark
              ? "border-[oklch(1_0_0/25%)] bg-brand-dark"
              : "border-border bg-background",
          )}
        />
      </div>
    </div>
  );
}
