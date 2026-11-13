"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SelectionTabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "border-r border-gray-200 px-4 text-sm font-semibold text-gray-700 last:border-r-0",
        active &&
          "bg-gray-50 text-gray-900 shadow-[inset_0_0_0_1px_rgba(16,24,40,0.04)]",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
