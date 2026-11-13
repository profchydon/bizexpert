"use client";

import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

// One live number with its label and an optional meter. Four of these carry the whole
// device in the top band, so the first screen answers the question without scrolling.
export function VitalCell({
  label,
  value,
  note,
  alert = false,
  meterPercent,
}: {
  label: string;
  value: ReactNode;
  note?: string;
  alert?: boolean;
  meterPercent?: number;
}) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3">
      <span className="text-xs text-tertiary">{label}</span>
      <span
        className={cx(
          "text-lg leading-none font-semibold",
          alert ? "text-error-primary" : "text-primary",
        )}
      >
        {value}
      </span>
      {meterPercent !== undefined && (
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-quaternary">
          <div
            className={cx(
              "h-full rounded-full",
              alert ? "bg-error-500" : "bg-success-500",
            )}
            style={{ width: `${Math.max(2, meterPercent)}%` }}
          />
        </div>
      )}
      {note && <span className="text-xs text-tertiary">{note}</span>}
    </div>
  );
}
