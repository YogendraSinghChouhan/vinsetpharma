"use client";

import { useEffect, useState } from "react";

export interface UseSaveShortcutOptions {
  onSave: () => void;
  disabled?: boolean;
}

/**
 * Listens for Ctrl+S / Cmd+S shortcuts, cancels default browser page save,
 * triggers the save handler, and announces the action to screen readers.
 */
export function useSaveShortcut({
  onSave,
  disabled = false,
}: UseSaveShortcutOptions) {
  const [announcement, setAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        event.stopPropagation();

        if (disabled) {
          setAnnouncement("Save is currently disabled or already in progress.");
          return;
        }

        setAnnouncement("Saving changes via keyboard shortcut.");
        onSave();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave, disabled]);

  return {
    announcement,
  };
}
