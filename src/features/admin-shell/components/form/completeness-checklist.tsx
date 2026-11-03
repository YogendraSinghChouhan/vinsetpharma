"use client";

import { IconCheck, IconCircle, IconExternalLink } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type ChecklistItemState, calculateCompleteness } from "./form-helpers";

export interface CompletenessChecklistProps {
  items: ChecklistItemState[];
  title?: string;
  className?: string;
}

export function CompletenessChecklist({
  items,
  title = "Readiness Checklist",
  className,
}: CompletenessChecklistProps) {
  const { percentage, isComplete, statusLabel } = calculateCompleteness(items);

  function handleJumpToField(fieldId?: string) {
    if (!fieldId) return;
    const el = document.getElementById(fieldId);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    // Focus the interactive input/textarea/button if found
    const focusable =
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLSelectElement ||
      el instanceof HTMLButtonElement
        ? el
        : el.querySelector<HTMLElement>(
            "input, textarea, select, button, [tabindex]:not([tabindex='-1'])",
          );

    if (focusable) {
      focusable.focus();
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs space-y-4",
        className,
      )}
    >
      {/* Header and status */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-heading text-sm font-semibold text-foreground tracking-tight">
          {title}
        </h3>
        <Badge
          variant={isComplete ? "default" : "secondary"}
          className={cn(
            "text-[10px] uppercase tracking-wider font-semibold",
            isComplete && "bg-emerald-600 hover:bg-emerald-600 text-white",
          )}
        >
          {isComplete ? "Ready" : `${percentage}%`}
        </Badge>
      </div>

      {/* Progress Bar with accessible text label */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{statusLabel}</span>
          <span className="font-medium text-foreground">{percentage}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${title}: ${statusLabel}`}
          className="h-2 w-full overflow-hidden rounded-full bg-muted/80"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300 ease-out",
              isComplete ? "bg-emerald-600" : "bg-primary",
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <ul className="space-y-2 list-none p-0 m-0">
        {items.map((item) => (
          <li key={item.id} className="text-xs">
            {item.fieldId ? (
              <button
                type="button"
                onClick={() => handleJumpToField(item.fieldId)}
                className="group flex w-full items-start gap-2.5 rounded-md p-1.5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Jump to ${item.label} (${item.done ? "completed" : "incomplete"})`}
              >
                <span className="mt-0.5 shrink-0">
                  {item.done ? (
                    <span className="flex size-4 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                      <IconCheck
                        className="size-3 stroke-[2.5]"
                        aria-hidden="true"
                      />
                    </span>
                  ) : (
                    <span className="flex size-4 items-center justify-center text-muted-foreground/60">
                      <IconCircle
                        className="size-3.5 stroke-[1.5]"
                        aria-hidden="true"
                      />
                    </span>
                  )}
                </span>
                <span className="flex-1">
                  <span
                    className={cn(
                      "font-medium text-foreground transition-colors group-hover:text-primary",
                      item.done &&
                        "text-muted-foreground line-through decoration-muted-foreground/40",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.hint && (
                    <span className="block text-[11px] text-muted-foreground font-normal mt-0.5">
                      {item.hint}
                    </span>
                  )}
                </span>
                <IconExternalLink
                  className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              </button>
            ) : (
              <div className="flex items-start gap-2.5 p-1.5 text-left">
                <span className="mt-0.5 shrink-0">
                  {item.done ? (
                    <span className="flex size-4 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600">
                      <IconCheck
                        className="size-3 stroke-[2.5]"
                        aria-hidden="true"
                      />
                    </span>
                  ) : (
                    <span className="flex size-4 items-center justify-center text-muted-foreground/60">
                      <IconCircle
                        className="size-3.5 stroke-[1.5]"
                        aria-hidden="true"
                      />
                    </span>
                  )}
                </span>
                <span className="flex-1">
                  <span
                    className={cn(
                      "font-medium text-foreground",
                      item.done &&
                        "text-muted-foreground line-through decoration-muted-foreground/40",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.hint && (
                    <span className="block text-[11px] text-muted-foreground mt-0.5">
                      {item.hint}
                    </span>
                  )}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
