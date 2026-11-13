"use client";

import { AlertTriangle } from "@untitledui/icons";

export const WORK_STARTED_NOTICE =
  "Work has already started on this order. You should not expect a full refund if this cancellation is approved.";

export function WorkStartedNotice() {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-lg border border-utility-warning-200 bg-utility-warning-50 p-3">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-utility-warning-600" />
      <p className="text-xs text-utility-warning-700">{WORK_STARTED_NOTICE}</p>
    </div>
  );
}
