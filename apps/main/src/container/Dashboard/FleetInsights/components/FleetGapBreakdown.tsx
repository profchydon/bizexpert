"use client";

import { useState } from "react";
import type { TelemetryDevice } from "@/types/telemetry";
import { buildGapGroups } from "../utils/groupBreakdowns";
import type { FleetListFilter, GapDimension } from "../utils/fleetFilters";

const DIMENSIONS: { id: GapDimension; label: string }[] = [
  { id: "entity", label: "Entity" },
  { id: "office", label: "Office" },
  { id: "os", label: "OS" },
  { id: "ownership", label: "Ownership" },
];

export function FleetGapBreakdown({
  devices,
  onFilter,
}: Readonly<{
  devices: TelemetryDevice[];
  onFilter: (filter: FleetListFilter) => void;
}>) {
  const [dimension, setDimension] = useState<GapDimension>("entity");
  const groups = buildGapGroups(devices, dimension);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">
          Where the gaps are
        </h3>
        <div className="flex flex-wrap gap-2">
          {DIMENSIONS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setDimension(entry.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                dimension === entry.id
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>
      <ul className="space-y-3">
        {groups.map((group) => (
          <li key={group.key}>
            <button
              type="button"
              className="flex w-full flex-col gap-2 rounded-lg border border-gray-100 p-3 text-left hover:bg-gray-50"
              onClick={() =>
                onFilter({
                  kind: "group",
                  dimension,
                  groupKey: group.key,
                })
              }
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-gray-900">
                  {group.label}
                </span>
                <span className="text-xs text-gray-500">
                  {group.deviceCount} devices · {Math.round(group.passRate)}%
                </span>
              </div>
              <div className="flex h-2 overflow-hidden rounded-full bg-gray-100">
                <span
                  className="bg-success-500"
                  style={{
                    width: `${(group.healthy / Math.max(group.deviceCount, 1)) * 100}%`,
                  }}
                />
                <span
                  className="bg-warning-500"
                  style={{
                    width: `${(group.attention / Math.max(group.deviceCount, 1)) * 100}%`,
                  }}
                />
                <span
                  className="bg-error-500"
                  style={{
                    width: `${(group.critical / Math.max(group.deviceCount, 1)) * 100}%`,
                  }}
                />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
