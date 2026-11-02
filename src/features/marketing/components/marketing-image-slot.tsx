import Image from "next/image";
import { BlisterPocket } from "@/components/brand/blister-pocket";
import { cn } from "@/lib/utils";
import type { ImageSlot } from "../images";

type MarketingImageSlotProps = {
  slot: ImageSlot;
  priority?: boolean;
  sizes?: string;
  className?: string;
  aspectClassName?: string;
};

export function MarketingImageSlot({
  slot,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px",
  className,
  aspectClassName = "aspect-16/10 sm:aspect-16/9",
}: MarketingImageSlotProps) {
  if (!slot) {
    // Decorative text-free fallback panel when slot is unassigned
    return (
      <BlisterPocket
        depth="subtle"
        className={cn(
          "relative w-full overflow-hidden border-border/80 bg-surface-tint p-2 flex items-center justify-center",
          className,
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-surface-tint to-accent/10 flex items-center justify-center ring-1 ring-border/60",
            aspectClassName,
          )}
        >
          <div className="flex size-16 items-center justify-center rounded-full bg-card/80 backdrop-blur-xs shadow-2xs ring-1 ring-border/50">
            <div className="size-7 rounded-full border-2 border-dashed border-primary/40 animate-pulse" />
          </div>
        </div>
      </BlisterPocket>
    );
  }

  return (
    <BlisterPocket
      depth="subtle"
      className={cn(
        "relative w-full overflow-hidden border-border/80 bg-surface-tint p-2 sm:p-2.5",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl bg-muted ring-1 ring-border/60",
          aspectClassName,
        )}
      >
        <Image
          src={slot.src}
          alt={slot.alt}
          width={slot.width}
          height={slot.height}
          priority={priority}
          sizes={sizes}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
        />
      </div>
    </BlisterPocket>
  );
}
