"use client";

import { useEffect, useRef } from "react";

export function useCloseCartAfterCheckoutNavigation(
  isCheckoutNavigating: boolean,
  onClose: () => void,
) {
  const wasNavigatingRef = useRef(false);

  useEffect(() => {
    if (isCheckoutNavigating) {
      wasNavigatingRef.current = true;
      return;
    }
    if (wasNavigatingRef.current) {
      wasNavigatingRef.current = false;
      onClose();
    }
  }, [isCheckoutNavigating, onClose]);
}
