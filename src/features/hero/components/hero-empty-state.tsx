import { IconSlideshow } from "@tabler/icons-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function HeroEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-8 sm:p-12 text-center shadow-2xs">
      <Empty>
        <EmptyMedia
          variant="icon"
          className="size-12 rounded-2xl bg-primary/10 text-primary"
        >
          <IconSlideshow className="size-6" aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle className="text-base sm:text-lg font-semibold text-foreground">
            No banner images yet
          </EmptyTitle>
          <EmptyDescription className="text-sm text-muted-foreground max-w-md">
            The home page shows the default banner until you upload.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
