"use client";

import { IconAlertTriangle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface UnsavedChangesGuardOptions {
  isDirty: boolean;
  onDiscard?: () => void;
}

export function useUnsavedChangesGuard({
  isDirty,
  onDiscard,
}: UnsavedChangesGuardOptions) {
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  // Native browser prompt when leaving page or refreshing
  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function requestCancel(fallback: () => void) {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      (onDiscard ?? fallback)();
    }
  }

  function confirmDiscard(fallback: () => void) {
    setShowDiscardDialog(false);
    (onDiscard ?? fallback)();
  }

  return {
    showDiscardDialog,
    setShowDiscardDialog,
    requestCancel,
    confirmDiscard,
  };
}

export interface DiscardChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function DiscardChangesDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Discard unsaved changes?",
  description = "You have unsaved changes in this form. If you leave now, your edits will be permanently lost.",
}: DiscardChangesDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <IconAlertTriangle className="size-5 shrink-0" aria-hidden="true" />
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Editing</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Discard Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
