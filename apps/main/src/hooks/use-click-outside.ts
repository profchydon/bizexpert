import { RefObject, useEffect } from "react";

function useClickOutside<T extends HTMLElement>({
  isEnabled,
  onOutsideClick,
  ref,
}: {
  isEnabled: boolean;
  onOutsideClick: () => void;
  ref: RefObject<T | null>;
}) {
  useEffect(() => {
    if (!isEnabled) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        onOutsideClick();
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isEnabled, onOutsideClick, ref]);
}

export { useClickOutside };
