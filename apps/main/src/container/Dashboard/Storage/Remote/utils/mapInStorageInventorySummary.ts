import type { IInStorageInventorySummary } from "@/types/equipmentsInStorageInventory";
import type { BarSegment } from "../components/DistributionBar";
import { DEVICE_TYPE_BAR_CLASS } from "../data/deviceTypeMeta";
import { STATUS_LABEL } from "../data/storageMeta";
import type { DeviceType, StorageStatus } from "../types/storage";
import { DEVICE_TYPES } from "../types/storage";
import { STATUS_TOOLTIP } from "../utils/badgeTooltips";
import {
  mapAssetTypeToDeviceType,
  mapStorageStatus,
} from "../utils/inStorageInventoryMaps";
import { STATUS_BAR_CLASS, STATUS_BAR_ORDER } from "../utils/statusBar";
import { countryBarClass } from "../utils/countryBarClasses";
import type { StorageCountryOption } from "../types/inventoryApi";

export interface StorageInventoryOverview {
  totalCount: number;
  assetTypeCount: number;
  needsActionCount: number;
  assetSegments: BarSegment[];
  statusSegments: BarSegment[];
  countrySegments: BarSegment[];
  countryOptions: StorageCountryOption[];
  countries: number;
  topCountry: string;
  deviceTypes: DeviceType[];
}

function assetSegments(summary: IInStorageInventorySummary): BarSegment[] {
  const counts = new Map<DeviceType, number>();
  for (const row of summary.by_asset_type) {
    if (row.count <= 0) continue;
    const deviceType = mapAssetTypeToDeviceType(row.asset_type);
    counts.set(deviceType, (counts.get(deviceType) ?? 0) + row.count);
  }
  return [...counts.entries()]
    .sort(
      (a, b) =>
        b[1] - a[1] || DEVICE_TYPES.indexOf(a[0]) - DEVICE_TYPES.indexOf(b[0]),
    )
    .map(([deviceType, count]) => ({
      key: deviceType,
      label: deviceType,
      count,
      colorClass: DEVICE_TYPE_BAR_CLASS[deviceType],
      tooltip: `${count} ${count === 1 ? "device" : "devices"} in storage · click to filter`,
    }));
}

function statusSegments(summary: IInStorageInventorySummary): BarSegment[] {
  const counts = new Map<StorageStatus, number>();
  for (const row of summary.by_status) {
    if (row.count <= 0) continue;
    const status = mapStorageStatus(row.status);
    counts.set(status, (counts.get(status) ?? 0) + row.count);
  }
  return STATUS_BAR_ORDER.filter((status) => (counts.get(status) ?? 0) > 0).map(
    (status) => ({
      key: status,
      label: STATUS_LABEL[status],
      count: counts.get(status) ?? 0,
      colorClass: STATUS_BAR_CLASS[status],
      tooltip: STATUS_TOOLTIP[status],
    }),
  );
}

function countrySegments(summary: IInStorageInventorySummary): BarSegment[] {
  return [...summary.by_country]
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country))
    .map((row, index) => ({
      key: row.country_id,
      label: row.country,
      count: row.count,
      colorClass: countryBarClass(index),
      tooltip: `${row.count} ${row.count === 1 ? "device" : "devices"} in ${row.country} · click to filter`,
    }));
}

function countryOptions(
  summary: IInStorageInventorySummary,
): StorageCountryOption[] {
  return [...summary.by_country]
    .sort((a, b) => b.count - a.count)
    .map((row) => ({
      id: row.country_id,
      name: row.country,
      code: row.country_code,
    }));
}

export function mapInStorageInventorySummary(
  summary: IInStorageInventorySummary | undefined,
): StorageInventoryOverview {
  if (!summary) {
    return {
      totalCount: 0,
      assetTypeCount: 0,
      needsActionCount: 0,
      assetSegments: [],
      statusSegments: [],
      countrySegments: [],
      countryOptions: [],
      countries: 0,
      topCountry: "—",
      deviceTypes: [],
    };
  }

  const top = [...summary.by_country].sort((a, b) => b.count - a.count)[0];
  const deviceTypes = summary.by_asset_type
    .filter((row) => row.count > 0)
    .map((row) => mapAssetTypeToDeviceType(row.asset_type))
    .filter((type, index, list) => list.indexOf(type) === index)
    .sort((a, b) => DEVICE_TYPES.indexOf(a) - DEVICE_TYPES.indexOf(b));

  return {
    totalCount: summary.total_count,
    assetTypeCount: summary.asset_type_count,
    needsActionCount: summary.needs_action_count,
    assetSegments: assetSegments(summary),
    statusSegments: statusSegments(summary),
    countrySegments: countrySegments(summary),
    countryOptions: countryOptions(summary),
    countries: summary.by_country.length,
    topCountry: top ? `${top.country} (${top.count})` : "—",
    deviceTypes,
  };
}
