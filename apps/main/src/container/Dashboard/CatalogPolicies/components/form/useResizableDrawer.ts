"use client";

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export function useResizableDrawer({
  minWidth,
  maxWidth,
  defaultWidth,
}: {
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
}) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ x: 0, width: defaultWidth });

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const delta = resizeStart.current.x - event.clientX;
      setWidth(
        Math.min(
          maxWidth,
          Math.max(minWidth, resizeStart.current.width + delta),
        ),
      );
    },
    [maxWidth, minWidth],
  );

  const stopResize = useCallback(() => {
    setIsResizing(false);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", stopResize);
  }, [handlePointerMove]);

  const startResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    resizeStart.current = { x: event.clientX, width };
    setIsResizing(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
    };
  }, [handlePointerMove, stopResize]);

  return { width, isResizing, startResize };
}
