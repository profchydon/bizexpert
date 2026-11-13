"use client";

import { useEffect } from "react";

export function useWizardAdminPickerDismiss(
  open: boolean,
  rootRef: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  onClosed?: () => void,
) {
  useEffect(() => {
    if (!open) {
      onClosed?.();
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onClosed, open, rootRef]);
}
