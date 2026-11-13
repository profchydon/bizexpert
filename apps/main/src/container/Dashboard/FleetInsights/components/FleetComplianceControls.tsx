"use client";

import type { FleetControlItem } from "@/types/telemetry";
import {
  controlPassSummary,
  controlTrendLabel,
  FLEET_CONTROL_KEYS,
  findControlItem,
  resolveControlLabel,
  type FleetControlKey,
} from "../utils/controlMechanisms";
import type { FleetListFilter } from "../utils/fleetFilters";

export function FleetComplianceControls({
  controls,
  onFilter,
}: Readonly<{
  controls: FleetControlItem[];
  onFilter: (filter: FleetListFilter) => void;
}>) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Compliance by control
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2 pr-4 font-medium">Control</th>
              <th className="py-2 pr-4 font-medium">Passing now</th>
              <th className="py-2 pr-4 font-medium">Trend, 30 days</th>
              <th className="py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {FLEET_CONTROL_KEYS.map((key) => {
              const item = findControlItem(controls, key);
              return (
                <ControlRow
                  key={key}
                  controlKey={key}
                  item={item}
                  onFilter={onFilter}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ControlRow({
  controlKey,
  item,
  onFilter,
}: Readonly<{
  controlKey: FleetControlKey;
  item?: FleetControlItem;
  onFilter: (filter: FleetListFilter) => void;
}>) {
  const failCount = item?.fail_count ?? 0;
  const unknownCount = item?.unknown_count ?? 0;

  return (
    <tr className="border-b border-gray-100 last:border-none">
      <td className="py-3 pr-4 font-medium text-gray-900">
        {resolveControlLabel(controlKey)}
      </td>
      <td className="py-3 pr-4 text-gray-700">{controlPassSummary(item)}</td>
      <td className="py-3 pr-4 text-gray-700">{controlTrendLabel(item)}</td>
      <td className="py-3">
        <div className="flex flex-wrap gap-2">
          {failCount > 0 ? (
            <button
              type="button"
              className="rounded-md bg-error-50 px-2 py-1 text-xs font-medium text-error-700"
              onClick={() =>
                onFilter({
                  kind: "control",
                  controlKey,
                  segment: "fail",
                })
              }
            >
              {failCount} failing
            </button>
          ) : null}
          {unknownCount > 0 ? (
            <button
              type="button"
              className="rounded-md bg-warning-50 px-2 py-1 text-xs font-medium text-warning-700"
              onClick={() =>
                onFilter({
                  kind: "control",
                  controlKey,
                  segment: "unknown",
                })
              }
            >
              {unknownCount} unknown
            </button>
          ) : null}
        </div>
      </td>
    </tr>
  );
}
