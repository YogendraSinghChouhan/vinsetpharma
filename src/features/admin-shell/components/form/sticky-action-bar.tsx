import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export interface StickyActionBarProps {
  isSubmitting?: boolean;
  isDirty?: boolean;
  onCancel: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  stateText?: string;
  disabled?: boolean;
  className?: string;
}

export function StickyActionBar({
  isSubmitting = false,
  isDirty = false,
  onCancel,
  saveLabel = "Save Changes",
  cancelLabel = "Cancel",
  stateText,
  disabled = false,
  className,
}: StickyActionBarProps) {
  const defaultStateText = isSubmitting
    ? "Saving changes..."
    : isDirty
      ? "You have unsaved changes"
      : "No unsaved changes";

  const resolvedStateText = stateText ?? defaultStateText;

  return (
    <aside
      aria-label="Form actions"
      className={cn(
        "sticky bottom-0 z-40 -mx-4 sm:-mx-6 -mb-6 mt-8 border-t border-border bg-card/95 backdrop-blur-md px-4 py-3 sm:px-6 shadow-lg",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        {/* State text */}
        <div className="flex items-center gap-2 text-xs">
          <span
            className={cn(
              "size-2 rounded-full shrink-0",
              isSubmitting
                ? "bg-primary animate-pulse"
                : isDirty
                  ? "bg-amber-500 animate-pulse"
                  : "bg-emerald-500",
            )}
            aria-hidden="true"
          />
          <span className="text-muted-foreground font-medium hidden sm:inline-block">
            {resolvedStateText}
          </span>
          <span className="text-muted-foreground font-medium sm:hidden truncate max-w-[140px]">
            {isSubmitting ? "Saving..." : isDirty ? "Unsaved" : "Saved"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
            className="min-h-[44px] sm:min-h-9 px-4 text-xs font-semibold"
          >
            {cancelLabel}
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={disabled || isSubmitting}
            className="min-h-[44px] sm:min-h-9 px-5 text-xs font-semibold gap-1.5 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-3.5 mr-1" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>{saveLabel}</span>
                <kbd className="hidden md:inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-mono bg-primary-foreground/20 text-primary-foreground border-transparent">
                  <span className="text-[10px]">Ctrl+S</span>
                </kbd>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
