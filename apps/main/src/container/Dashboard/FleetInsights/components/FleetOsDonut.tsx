"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { TelemetryDevice } from "@/types/telemetry";
import { buildOsSegments } from "../utils/osSegments";
import type { FleetListFilter } from "../utils/fleetFilters";

export function FleetOsDonut({
  devices,
  onFilter,
}: Readonly<{
  devices: TelemetryDevice[];
  onFilter: (filter: FleetListFilter) => void;
}>) {
  const segments = buildOsSegments(devices);
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);

  if (total === 0) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Operating systems
        </h3>
        <p className="mt-4 text-sm text-gray-500">No reporting devices yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Operating systems
      </h3>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="relative mx-auto size-[160px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                dataKey="count"
                nameKey="label"
                innerRadius={52}
                outerRadius={72}
                stroke="none"
                startAngle={90}
                endAngle={-270}
                isAnimationActive={false}
              >
                {segments.map((segment) => (
                  <Cell key={segment.key} fill={segment.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-gray-900">
              {total}
            </span>
            <span className="text-xs text-gray-500">reporting</span>
          </div>
        </div>
        <ul className="flex flex-1 flex-col gap-2">
          {segments.map((segment) => (
            <li key={segment.key}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-md px-2 py-1 text-left hover:bg-gray-50"
                onClick={() => onFilter({ kind: "os", osKey: segment.key })}
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="flex-1 text-sm text-gray-700">
                  {segment.label}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {segment.count}
                </span>
                {segment.behindCount > 0 ? (
                  <span className="text-xs text-warning-700">
                    {segment.behindCount} behind
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
