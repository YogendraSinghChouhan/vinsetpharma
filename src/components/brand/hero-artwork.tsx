import { cn } from "@/lib/utils";

type HeroArtworkProps = {
  className?: string;
};

/**
 * Hero artwork built from SVG and CSS.
 * Illustrates pharmaceutical precision: two capsule halves sliding together and locking
 * into clinical equilibrium inside a debossed blister pack cavity.
 * Respects prefers-reduced-motion via CSS keyframes with zero client JS overhead.
 */
export function HeroArtwork({ className }: HeroArtworkProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center select-none w-full max-w-full overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 500 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-full h-auto drop-shadow-sm"
        aria-hidden="true"
      >
        <title>Pharmaceutical capsule formulation artwork</title>
        <defs>
          {/* Subtle cavity depth gradient for the blister well */}
          <radialGradient
            id="blisterWellGrad"
            cx="50%"
            cy="50%"
            r="50%"
            fx="45%"
            fy="45%"
          >
            <stop
              offset="0%"
              stopColor="var(--color-surface-tint)"
              stopOpacity="0.9"
            />
            <stop
              offset="75%"
              stopColor="var(--color-surface-tint)"
              stopOpacity="0.4"
            />
            <stop
              offset="100%"
              stopColor="var(--color-surface-tint)"
              stopOpacity="0"
            />
          </radialGradient>

          {/* Primary capsule cap gradient for subtle volume without flat wash */}
          <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#004ab8" />
            <stop offset="100%" stopColor="#00358a" />
          </linearGradient>

          {/* Sky Cerulean body gradient */}
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Pill foil cavity clip */}
          <clipPath id="capsuleClip">
            <rect x="140" y="90" width="220" height="240" rx="36" />
          </clipPath>
        </defs>

        {/* Outer blister pack pocket deboss: subtle rectangular cell with rounded corners */}
        <rect
          x="30"
          y="30"
          width="440"
          height="360"
          rx="32"
          fill="url(#blisterWellGrad)"
          stroke="var(--color-border)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Concentric cavity contour rings mimicking thermoformed pharmaceutical foil */}
        <ellipse
          cx="250"
          cy="210"
          rx="170"
          ry="130"
          stroke="var(--color-border)"
          strokeWidth="1"
          strokeOpacity="0.7"
        />
        <ellipse
          cx="250"
          cy="210"
          rx="140"
          ry="105"
          stroke="var(--color-border)"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        {/* Foil sheet corner registration crosses */}
        <g stroke="var(--color-border)" strokeWidth="1.2">
          <path d="M 50 45 L 50 55 M 45 50 L 55 50" />
          <path d="M 450 45 L 450 55 M 445 50 L 455 50" />
          <path d="M 50 365 L 50 375 M 45 370 L 55 370" />
          <path d="M 450 365 L 450 375 M 445 370 L 455 370" />
        </g>

        {/* Central Blister Pack Well: Soft recessed pocket where the capsule rests */}
        <rect
          x="145"
          y="105"
          width="210"
          height="210"
          rx="105"
          fill="var(--color-card)"
          stroke="var(--color-border)"
          strokeWidth="1.5"
          className="shadow-inner"
        />

        {/* THE CAPSULE (Orchestrated glide animation): Center pivot (250, 210) */}
        {/* Left / Top Half: slides in from upper-left along axis */}
        <g
          className="animate-capsule-glide-left"
          style={{ transformOrigin: "250px 210px" }}
        >
          <g transform="translate(250, 210)">
            {/* Cap half: rounded top dome */}
            <path
              d="M -38 -60 C -38 -84 -16 -102 0 -102 C 16 -102 38 -84 38 -60 L 38 0 L -38 0 Z"
              fill="url(#capGrad)"
            />
            {/* Gloss specular reflection curve */}
            <path
              d="M -24 -64 C -24 -80 -10 -90 0 -90"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeOpacity="0.45"
            />
            {/* Precision cap rim bevel */}
            <line
              x1="-38"
              y1="-2"
              x2="38"
              y2="-2"
              stroke="#002266"
              strokeWidth="2"
            />
          </g>
        </g>

        {/* Right / Bottom Half: slides in from lower-right along axis */}
        <g
          className="animate-capsule-glide-right"
          style={{ transformOrigin: "250px 210px" }}
        >
          <g transform="translate(250, 210)">
            {/* Body half: rounded bottom dome */}
            <path
              d="M -38 4 L 38 4 L 38 60 C 38 84 16 102 0 102 C -16 102 -38 84 -38 60 Z"
              fill="url(#bodyGrad)"
            />
            {/* Translucent fill line marker */}
            <ellipse
              cx="0"
              cy="34"
              rx="28"
              ry="4"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
            {/* Specular sheen on body */}
            <path
              d="M 24 55 C 24 72 12 85 0 85"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.45"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
