import { IconAlertTriangle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
  id?: string;
}

export function CharacterCounter({
  current,
  max,
  className,
  id,
}: CharacterCounterProps) {
  const remaining = max - current;
  const isNearLimit = remaining <= 20 && remaining >= 0;
  const isExceeded = remaining < 0;

  // Screen reader status message near limit or exceeded
  const statusMessage = isExceeded
    ? `Limit exceeded by ${Math.abs(remaining)} characters`
    : isNearLimit
      ? `${remaining} characters remaining`
      : undefined;

  return (
    <div
      id={id}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground select-none",
        isNearLimit && "font-semibold text-amber-600 dark:text-amber-400",
        isExceeded && "font-bold text-destructive",
        className,
      )}
      aria-live={isNearLimit || isExceeded ? "polite" : "off"}
      aria-atomic="true"
    >
      {isExceeded && (
        <IconAlertTriangle
          className="size-3.5 shrink-0 text-destructive"
          aria-hidden="true"
        />
      )}
      {isNearLimit && !isExceeded && (
        <span
          className="size-1.5 rounded-full bg-amber-500 animate-pulse"
          aria-hidden="true"
        />
      )}

      <span>
        {current}/{max}
      </span>

      {isExceeded && (
        <span className="text-[11px] font-medium text-destructive underline decoration-dotted">
          (limit reached)
        </span>
      )}
      {isNearLimit && !isExceeded && (
        <span className="text-[11px] font-normal text-muted-foreground">
          ({remaining} left)
        </span>
      )}

      {statusMessage && <span className="sr-only">{statusMessage}</span>}
    </div>
  );
}
