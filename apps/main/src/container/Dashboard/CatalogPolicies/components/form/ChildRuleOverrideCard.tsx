"use client";

import { cn } from "@/lib/utils";

export function OverrideCard({
  selected,
  onToggle,
  label,
  hint,
  children,
}: {
  selected: boolean;
  onToggle: (next: boolean) => void;
  label: string;
  hint: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        selected ? "border-primary-300 bg-primary-50" : "border-gray-200",
      )}
    >
      <button
        type="button"
        className="flex w-full items-start gap-3 text-left"
        onClick={() => onToggle(!selected)}
      >
        <span
          className={cn(
            "mt-0.5 flex h-5 w-9 rounded-full p-0.5",
            selected ? "bg-primary-600" : "bg-gray-100",
          )}
        >
          <span
            className={cn(
              "h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
              selected && "translate-x-4",
            )}
          />
        </span>
        <span>
          <span className="block text-sm font-normal text-gray-900">
            {label}
          </span>
          <span className="block text-sm leading-5 text-gray-500">{hint}</span>
        </span>
      </button>
      {selected && children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
