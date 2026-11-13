import type { SortDescriptor } from "react-aria-components";
import { resolveEntityOffice } from "@/container/Dashboard/Accounts/utils/resolveEntityOffice";
import type {
  DeviceType,
  InventoryFilters,
  StoredDevice,
} from "../types/storage";
import { DEVICE_TYPES } from "../types/storage";
import { needsAction } from "./deriveDevice";

const SORT_VALUE: Record<string, (d: StoredDevice) => string | number> = {
  device: (d) => d.deviceName.toLowerCase(),
  country: (d) => d.country.toLowerCase(),
  entity: (d) => resolveEntityOffice(d.country).entityName.toLowerCase(),
  grade: (d) => d.grade ?? "Z",
  entry: (d) => new Date(d.entryDate).getTime(),
  status: (d) => d.status,
};

export function sortDevices(
  devices: StoredDevice[],
  sort?: SortDescriptor,
): StoredDevice[] {
  if (!sort?.column) return devices;
  const getValue = SORT_VALUE[String(sort.column)];
  if (!getValue) return devices;
  const sorted = [...devices].sort((a, b) => {
    const av = getValue(a);
    const bv = getValue(b);
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });
  return sort.direction === "descending" ? sorted.reverse() : sorted;
}

export function filterDevices(
  devices: StoredDevice[],
  filters: InventoryFilters,
): StoredDevice[] {
  const query = filters.search.trim().toLowerCase();
  return devices.filter((d) => {
    if (filters.status !== "all" && d.status !== filters.status) return false;
    if (filters.country !== "all" && d.country !== filters.country)
      return false;
    if (filters.source !== "all" && d.entrySource !== filters.source)
      return false;
    if (filters.wipe !== "all" && d.wipeStatus !== filters.wipe) return false;
    if (filters.grade !== "all" && d.grade !== filters.grade) return false;
    if (filters.deviceType !== "all" && d.deviceType !== filters.deviceType)
      return false;
    if (filters.needsAction && !needsAction(d)) return false;
    if (!query) return true;
    return (
      d.deviceName.toLowerCase().includes(query) ||
      d.model.toLowerCase().includes(query) ||
      d.serialNumber.toLowerCase().includes(query) ||
      d.country.toLowerCase().includes(query)
    );
  });
}

export function groupByCountry(
  devices: StoredDevice[],
): { country: string; devices: StoredDevice[] }[] {
  const map = new Map<string, StoredDevice[]>();
  for (const d of devices) {
    const list = map.get(d.country) ?? [];
    list.push(d);
    map.set(d.country, list);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([country, items]) => ({ country, devices: items }));
}

export function uniqueCountries(devices: StoredDevice[]): string[] {
  return [...new Set(devices.map((d) => d.country))].sort((a, b) =>
    a.localeCompare(b),
  );
}

// Only the asset types actually present in the inventory, ordered by the canonical taxonomy.
export function uniqueDeviceTypes(devices: StoredDevice[]): DeviceType[] {
  const present = new Set(devices.map((d) => d.deviceType));
  return DEVICE_TYPES.filter((t) => present.has(t));
}
