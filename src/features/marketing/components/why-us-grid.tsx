import { BlisterPocket } from "@/components/brand/blister-pocket";
import { WHY_US_ICONS, type WhyUsPoint } from "../content";

type WhyUsGridProps = {
  points: readonly WhyUsPoint[];
  detailed?: boolean;
};

/**
 * WhyUsGrid: Asymmetric "Blister Ledger" composition for pharmaceutical credentials.
 * Replaces monotonous 3x2 repeating card templates with an engineered architectural layout:
 * - A primary formulation foundation panel (Quality Assurance & Ingredients)
 * - An offset operational quadrant (Trust, Mission, Reach, Customer Focus)
 */
export function WhyUsGrid({ points, detailed = false }: WhyUsGridProps) {
  const primaryPillars = points.slice(0, 2);
  const operationalPillars = points.slice(2);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-stretch">
      {/* Primary Foundation Panel (Quality Assurance & Ingredients) */}
      <div className="lg:col-span-5 flex flex-col min-w-0">
        <BlisterPocket
          depth="subtle"
          className="flex flex-1 flex-col justify-between p-6 sm:p-8 border-border/90 bg-surface-tint"
        >
          <div className="flex flex-col gap-8">
            {primaryPillars.map((point, index) => {
              const Icon = WHY_US_ICONS[point.icon];
              return (
                <div
                  key={point.title}
                  className={
                    index > 0
                      ? "pt-8 border-t border-dashed border-border/90 flex flex-col gap-3"
                      : "flex flex-col gap-3"
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-5 text-primary shrink-0" />
                    <h3 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                      {point.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {detailed
                      ? point.detailedDescription
                      : point.shortDescription}
                  </p>
                </div>
              );
            })}
          </div>
        </BlisterPocket>
      </div>

      {/* Operational Quadrant: 2x2 Offset Grid */}
      <div className="lg:col-span-7 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 min-w-0">
        {operationalPillars.map((point) => {
          const Icon = WHY_US_ICONS[point.icon];
          return (
            <div
              key={point.title}
              className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 sm:p-6 transition-colors hover:border-primary/40 shadow-2xs"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <Icon className="size-4.5 text-accent shrink-0" />
                  <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                    {point.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {detailed
                    ? point.detailedDescription
                    : point.shortDescription}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
