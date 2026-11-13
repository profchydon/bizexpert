import { type RefObject, useEffect } from "react";

export function useAccountsClickOutside({
  isEnabled,
  onOutsideClick,
  ref,
}: {
  isEnabled: boolean;
  onOutsideClick: () => void;
  ref: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!isEnabled) return;

    function handlePointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        onOutsideClick();
      }
    }

    const frame = requestAnimationFrame(() => {
      document.addEventListener("pointerdown", handlePointerDown);
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isEnabled, onOutsideClick, ref]);
}
