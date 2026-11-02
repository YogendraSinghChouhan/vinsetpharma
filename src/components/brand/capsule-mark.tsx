import { cn } from "@/lib/utils";

type CapsuleMarkProps = {
  className?: string;
  size?: number;
  /**
   * When inverted, adapts colors for deep dark surfaces (e.g. dark footer).
   */
  inverted?: boolean;
};

/**
 * Two-tone pharmaceutical capsule brand mark.
 * Represents precision formulation: marine primary coupled with therapeutic mint.
 */
export function CapsuleMark({
  className,
  size = 28,
  inverted = false,
}: CapsuleMarkProps) {
  const primaryColor = inverted ? "#ffffff" : "var(--color-primary)";
  const accentColor = "var(--color-accent-light)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <g transform="rotate(-32 16 16)">
        {/* Left half / cap */}
        <path d="M7 16C7 11.0294 11.0294 7 16 7V16H7Z" fill={primaryColor} />
        {/* Right half / body */}
        <path
          d="M16 16V25C20.9706 25 25 20.9706 25 16H16Z"
          fill={accentColor}
        />
        {/* Center precision seal line */}
        <line
          x1="16"
          y1="6"
          x2="16"
          y2="26"
          stroke={inverted ? "#06232b" : "#ffffff"}
          strokeWidth="1.5"
        />
        {/* Subtle highlight sheen */}
        <path
          d="M10 11C11.5 9.5 13.5 8.8 15 8.8"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
