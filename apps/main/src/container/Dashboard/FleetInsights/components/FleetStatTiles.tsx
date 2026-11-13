"use client";

import { X } from "lucide-react";
import type { FleetStats } from "@/types/telemetry";
import type { FleetListFilter, FleetStatTileId } from "../utils/fleetFilters";
import { hasRestartData, isRestartOverdue } from "../utils/fleetFilters";
import type { TelemetryDevice } from "@/types/telemetry";
import {
  countFailingControls,
  isCriticalDevice,
} from "../utils/fleetDeviceRating";

type TileConfig = {
  id: FleetStatTileId;
  label: string;
  caption: string;
  value: string;
};

function buildTiles(
  stats: FleetStats | undefined,
  devices: TelemetryDevice[],
): TileConfig[] {
  const vault = stats?.vault_count ?? devices.length;
  const reporting = stats?.reporting_count ?? 0;
  const critical = devices.filter(isCriticalDevice).length;
  const needsAttention =
    stats?.needs_attention_count ??
    devices.filter((device) => countFailingControls(device) > 0).length;
  const stale = stats?.stale_count ?? 0;
  const noAgent = stats?.no_agent_count ?? 0;
  const restartOverdue = devices.filter(isRestartOverdue).length;
  const restartValue = hasRestartData(devices)
    ? String(restartOverdue)
    : "Not collected";

  return [
    {
      id: "reporting",
      label: "Devices reporting",
      caption: "Active agent with a recent telemetry snapshot",
      value: `${reporting} of ${vault}`,
    },
    {
      id: "critical",
      label: "Critical",
      caption: "Two or more compliance controls failing",
      value: String(critical),
    },
    {
      id: "needs_attention",
      label: "Needs attention",
      caption: "At least one compliance control failing",
      value: String(needsAttention),
    },
    {
      id: "stale",
      label: "Stale",
      caption: "No sync in over 7 days",
      value: String(stale),
    },
    {
      id: "restart_overdue",
      label: "Restart overdue",
      caption: "No restart recorded in 14+ days when collected",
      value: restartValue,
    },
    {
      id: "no_agent",
      label: "No agent",
      caption: "In-scope equipment without an active agent",
      value: String(noAgent),
    },
  ];
}

export function FleetStatTiles({
  stats,
  devices,
  activeFilter,
  onSelect,
  onClear,
}: Readonly<{
  stats?: FleetStats;
  devices: TelemetryDevice[];
  activeFilter: FleetListFilter | null;
  onSelect: (filter: FleetListFilter) => void;
  onClear: () => void;
}>) {
  const tiles = buildTiles(stats, devices);

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {tiles.map((tile) => {
        const isActive =
          activeFilter?.kind === "tile" && activeFilter.tile === tile.id;
        return (
          <button
            key={tile.id}
            type="button"
            onClick={() => {
              if (isActive) {
                onClear();
                return;
              }
              onSelect({ kind: "tile", tile: tile.id });
            }}
            className={`rounded-xl border p-4 text-left transition ${
              isActive
                ? "border-primary-300 bg-primary-50 ring-1 ring-primary-200"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {tile.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {tile.value}
                </p>
                <p className="mt-1 text-xs text-gray-500">{tile.caption}</p>
              </div>
              {isActive ? (
                <X className="size-4 shrink-0 text-primary-600" />
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
