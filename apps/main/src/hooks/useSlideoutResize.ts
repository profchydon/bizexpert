"use client";

import { useCallback, useRef, useState } from "react";

export function useSlideoutResize(opts?: {
  min?: number;
  max?: number;
  initial?: number;
}) {
  const min = opts?.min ?? 400;
  const max = opts?.max ?? 640;
  const [width, setWidth] = useState(opts?.initial ?? min);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(width);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startW.current = width;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [width],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      e.stopPropagation();
      const delta = startX.current - e.clientX;
      setWidth(Math.min(max, Math.max(min, startW.current + delta)));
    },
    [min, max],
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return { width, handlers: { onPointerDown, onPointerMove, onPointerUp } };
}
