/**
 * Pure calculation helpers for form completeness and checklist progress.
 */

export interface ChecklistItemState {
  id: string;
  label: string;
  done: boolean;
  fieldId?: string;
  hint?: string;
}

export interface CompletenessResult {
  completedCount: number;
  totalCount: number;
  percentage: number;
  isComplete: boolean;
  statusLabel: string;
}

/**
 * Calculates completeness count and percentage for a list of checklist items.
 */
export function calculateCompleteness(
  items: readonly { done: boolean }[],
): CompletenessResult {
  const totalCount = items.length;
  if (totalCount === 0) {
    return {
      completedCount: 0,
      totalCount: 0,
      percentage: 100,
      isComplete: true,
      statusLabel: "All items completed",
    };
  }

  const completedCount = items.filter((item) => item.done).length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  const isComplete = completedCount === totalCount;

  return {
    completedCount,
    totalCount,
    percentage,
    isComplete,
    statusLabel: `${completedCount} of ${totalCount} completed (${percentage}%)`,
  };
}
