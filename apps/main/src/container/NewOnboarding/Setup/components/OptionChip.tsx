"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function OptionChip({
  label,
  selected,
  disabled,
  multiSelect,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  multiSelect?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition",
        selected
          ? "border-primary-600 bg-primary-50 text-primary-700 ring-1 ring-primary-600"
          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-primary-300 hover:bg-primary-25",
        disabled && "cursor-not-allowed",
      )}
    >
      {multiSelect && (
        <span
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-150",
            selected
              ? "border-primary-600 bg-primary-600"
              : "border-gray-300 bg-white",
          )}
        >
          {selected && (
            <Check className="size-2.5 text-white" strokeWidth={3} />
          )}
        </span>
      )}
      {label}
    </button>
  );
}
