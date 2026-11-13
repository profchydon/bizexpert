"use client";

import { useMemo, useState } from "react";
import { useResetTablePage } from "@/hooks/useResetTablePage";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import type { TelemetryDevice } from "@/types/telemetry";
import { Button } from "@/components/base/buttons/button";
import routes from "@/routes";
import {
  countFailingControls,
  resolveDeviceRating,
} from "../utils/fleetDeviceRating";
import { sortDevicesWorstFirst } from "../utils/fleetDeviceRating";
import type { FleetListFilter } from "../utils/fleetFilters";
import { applyFleetListFilter } from "../utils/fleetFilters";

const PAGE_SIZE = 10;

function ownershipClass(ownerType?: string | null): string {
  const normalized = ownerType?.toLowerCase() ?? "";
  if (normalized.includes("employee")) {
    return "bg-gray-100 text-gray-700";
  }
  return "bg-primary-50 text-primary-700";
}

function lastSeenLabel(device: TelemetryDevice): string {
  const raw =
    device.agent?.last_seen_at ?? device.telemetry?.collected_at ?? null;
  if (!raw) return "Not seen";
  try {
    return formatDistanceToNow(parseISO(raw), { addSuffix: true });
  } catch {
    return raw;
  }
}

export function FleetAttentionTable({
  devices,
  filter,
  tableRef,
}: Readonly<{
  devices: TelemetryDevice[];
  filter: FleetListFilter | null;
  tableRef: React.RefObject<HTMLDivElement | null>;
}>) {
  const { page, setPage } = useTablePageQuery();
  const [sortAsc, setSortAsc] = useState(false);
  useResetTablePage(setPage, filter, sortAsc);

  const filtered = useMemo(
    () => applyFleetListFilter(devices, filter),
    [devices, filter],
  );

  const sorted = useMemo(() => {
    const rows = sortDevicesWorstFirst(filtered);
    return sortAsc ? [...rows].reverse() : rows;
  }, [filtered, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <section
      ref={tableRef}
      className="rounded-xl border border-gray-200 bg-white p-6"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">
          Devices needing attention
        </h3>
        <button
          type="button"
          className="text-sm font-medium text-primary-600"
          onClick={() => setSortAsc((value) => !value)}
        >
          Sort {sortAsc ? "worst first" : "best first"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2 pr-4 font-medium">Device</th>
              <th className="py-2 pr-4 font-medium">Posture</th>
              <th className="py-2 pr-4 font-medium">Ownership</th>
              <th className="py-2 pr-4 font-medium">Last seen</th>
              <th className="py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((device) => {
              const failing = countFailingControls(device);
              const pass = device.telemetry?.compliance_pass_count ?? 0;
              const total = pass + failing;
              const rating = resolveDeviceRating(device);
              return (
                <tr
                  key={device.equipment_id}
                  className="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
                  onClick={() => {
                    window.location.href = `${routes.All_Equipments}/${device.equipment_id}`;
                  }}
                >
                  <td className="py-3 pr-4">
                    <p className="font-medium text-gray-900">{device.title}</p>
                    <p className="text-xs text-gray-500">
                      {device.serial_number ?? device.device_id ?? "No serial"}
                    </p>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-100">
                        <span
                          className={`block h-full ${
                            rating === "critical"
                              ? "bg-error-500"
                              : rating === "attention"
                                ? "bg-warning-500"
                                : "bg-success-500"
                          }`}
                          style={{
                            width: `${total > 0 ? (pass / total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {pass} of {total || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${ownershipClass(device.owner_type)}`}
                    >
                      {device.owner_type ?? "Unknown"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">
                    {lastSeenLabel(device)}
                  </td>
                  <td className="py-3">
                    <Link
                      href={`${routes.All_Equipments}/${device.equipment_id}`}
                      className="text-sm font-medium text-primary-600"
                      onClick={(event) => event.stopPropagation()}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">
          No devices match this filter.
        </p>
      ) : null}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            color="secondary"
            size="sm"
            isDisabled={currentPage <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            data-testid="fleetattentiontable-button"
          >
            Previous
          </Button>
          <Button
            color="secondary"
            size="sm"
            isDisabled={currentPage >= totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            data-testid="fleetattentiontable-button-2"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
