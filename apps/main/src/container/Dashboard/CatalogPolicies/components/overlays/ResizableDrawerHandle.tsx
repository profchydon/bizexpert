"use client";

import { cn } from "@/lib/utils";

export function ResizableDrawerHandle({
  resizing,
  onPointerDown,
}: {
  resizing: boolean;
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize drawer"
      onPointerDown={onPointerDown}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      data-slideout-handle
      data-ready={!resizing || undefined}
      className="absolute left-0 top-1/2 z-10 hidden -translate-x-full -translate-y-1/2 cursor-col-resize touch-none md:block"
    >
      <span
        className={cn(
          "flex h-8 w-5 items-center justify-center rounded-l-lg border border-r-0 border-gray-200 bg-white text-gray-400 shadow-md transition hover:text-gray-600",
          resizing && "text-gray-600",
        )}
      >
        <DotsGridIcon className="size-3.5" />
      </span>
    </div>
  );
}

function DotsGridIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      className={className}
    >
      {[4, 8, 12].map((x) =>
        [4, 8, 12].map((y) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="1.25"
            fill="currentColor"
          />
        )),
      )}
    </svg>
  );
}
