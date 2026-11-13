"use client";

import type { TelemetryDevice } from "@/types/telemetry";
import { hasRestartData, isRestartOverdue } from "../utils/fleetFilters";
import { restartMedianDays } from "../utils/osSegments";

const BUCKETS = ["Today", "1-3 days", "4-7 days", "8-14 days", "14+ days"];

export function FleetRestartHygiene({
  devices,
}: Readonly<{ devices: TelemetryDevice[] }>) {
  const collected = hasRestartData(devices);
  const median = restartMedianDays(devices);
  const overdue = devices.filter(isRestartOverdue);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">Restart hygiene</h3>
        {collected && median != null ? (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            Median {median} days
          </span>
        ) : null}
      </div>
      {!collected ? (
        <p className="text-sm text-gray-500">
          Restart age is not collected in telemetry snapshots yet.
        </p>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-5 gap-2 text-center text-xs text-gray-500">
            {BUCKETS.map((bucket) => (
              <span key={bucket}>{bucket}</span>
            ))}
          </div>
          <div className="flex min-h-12 flex-wrap gap-2">
            {devices
              .filter((device) => device.telemetry?.days_since_restart != null)
              .map((device) => (
                <span
                  key={device.equipment_id}
                  title={device.title}
                  className={`size-3 rounded-full ${
                    isRestartOverdue(device) ? "bg-error-500" : "bg-success-500"
                  }`}
                />
              ))}
          </div>
          <p className="mt-3 text-sm text-gray-600">
            {overdue.length} device{overdue.length === 1 ? "" : "s"} in the 14+
            day zone
          </p>
        </>
      )}
    </section>
  );
}
