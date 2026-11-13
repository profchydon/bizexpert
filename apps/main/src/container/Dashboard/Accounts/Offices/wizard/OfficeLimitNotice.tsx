"use client";

import { AlertTriangle } from "lucide-react";

export function OfficeLimitNotice({
  parentName,
  limit,
}: {
  parentName?: string;
  limit: number;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-warning-300 bg-warning-50 p-4">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning-600" />
      <div>
        <p className="text-sm font-semibold text-gray-900">
          Office limit reached
        </p>
        <p className="mt-1 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">
            {parentName ?? "This entity"}
          </span>{" "}
          already has {limit} office{limit === 1 ? "" : "s"}, your plan&apos;s
          limit. Physical and remote offices both count. Upgrade your plan to
          add more.
        </p>
      </div>
    </div>
  );
}
