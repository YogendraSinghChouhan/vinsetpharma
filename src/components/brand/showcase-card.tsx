/**
 * Shared presentational tokens ensuring ProductCard and CategoryCard
 * maintain identical dimensions, blister-pocket wells, padding, typography,
 * and corner radii.
 */
export const SHOWCASE_CARD_STYLES = {
  container:
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-4 transition-colors duration-200 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-2xs",
  pocket:
    "relative aspect-4/3 w-full p-4 flex items-center justify-center overflow-hidden",
  image: "object-contain p-3 transition-opacity group-hover:opacity-95",
  content: "flex flex-1 flex-col px-1 pb-1 pt-4",
  title:
    "font-heading text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary",
} as const;
