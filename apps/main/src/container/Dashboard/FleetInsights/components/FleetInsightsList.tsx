"use client";

import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import type { TelemetryDevice } from "@/types/telemetry";
import type { FleetInsight } from "../utils/buildFleetInsights";
import type { FleetListFilter } from "../utils/fleetFilters";

export function FleetInsightsList({
  insights,
  devices,
  onShowFilter,
}: Readonly<{
  insights: FleetInsight[];
  devices: TelemetryDevice[];
  onShowFilter: (filter: FleetListFilter) => void;
}>) {
  if (insights.length === 0) return null;

  const deviceById = new Map(
    devices.map((device) => [device.equipment_id, device]),
  );

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Insights</h3>
        <Badge color="gray" size="sm" type="pill-color">
          {insights.length}
        </Badge>
      </div>
      <ul className="space-y-4">
        {insights.map((insight) => {
          const preview = insight.deviceIds
            .slice(0, 3)
            .map((id) => deviceById.get(id)?.title ?? "Device")
            .join(", ");
          return (
            <li
              key={insight.id}
              className="flex flex-col gap-3 border-b border-gray-100 pb-4 last:border-none last:pb-0 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {insight.title}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {insight.description}
                </p>
                {preview ? (
                  <p className="mt-1 text-xs text-gray-500">{preview}</p>
                ) : null}
              </div>
              <Button
                color="secondary"
                size="sm"
                onClick={() =>
                  onShowFilter({
                    kind: "insight",
                    insightId: insight.id,
                    deviceIds: insight.deviceIds,
                  })
                }
                data-testid="fleetinsightslist-button"
              >
                Show
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
