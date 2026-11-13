"use client";

import { AlertTriangle } from "lucide-react";

import type { CatalogRuleConflict } from "@/types/catalogPolicy";
import { cn } from "@/lib/utils";

import {
  formatConflictEmployeeName,
  getPrimaryConflict,
} from "../../utilsConflicts";

export function ConflictDetectionBanner({
  acknowledged,
  conflicts,
  onAcknowledge,
  requiresAcknowledgment,
}: {
  acknowledged: boolean;
  conflicts: CatalogRuleConflict[];
  onAcknowledge: () => void;
  requiresAcknowledgment: boolean;
}) {
  if (!conflicts.length || acknowledged) return null;
  const conflict = getPrimaryConflict(conflicts);
  if (!conflict) return null;

  const isRed = !requiresAcknowledgment;
  const employeeNames =
    conflict.sample_employees?.map(formatConflictEmployeeName) ?? [];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border-2 p-4",
        isRed
          ? "border-error-200 bg-error-50"
          : "border-warning-300 bg-warning-50",
      )}
    >
      <div className="flex items-start gap-2">
        <AlertTriangle
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0",
            isRed ? "text-error-600" : "text-warning-600",
          )}
        />
        <div className="flex min-w-0 flex-col gap-1 text-sm">
          <p
            className={cn(
              "font-normal",
              isRed ? "text-error-700" : "text-warning-700",
            )}
          >
            {conflict.message}
          </p>
          {employeeNames.length ? (
            <p className={isRed ? "text-error-600" : "text-warning-600"}>
              {employeeNames.join(", ")}
            </p>
          ) : null}
        </div>
      </div>
      {requiresAcknowledgment ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onAcknowledge}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Acknowledge
          </button>
        </div>
      ) : null}
    </div>
  );
}
