import type { DeviceType, StoredDevice } from "../types/storage";
import { DEVICE_TYPES } from "../types/storage";

export function countByDeviceType(
  devices: StoredDevice[],
): Record<DeviceType, number> {
  const counts = Object.fromEntries(DEVICE_TYPES.map((t) => [t, 0])) as Record<
    DeviceType,
    number
  >;
  for (const d of devices) counts[d.deviceType] += 1;
  return counts;
}

export interface DeviceTypeSegment {
  type: DeviceType;
  count: number;
}

// Only the asset types actually present, ordered by count (desc), tie-broken by the
// canonical taxonomy order so the bar/tiles read consistently.
export function deviceTypeSegments(
  devices: StoredDevice[],
): DeviceTypeSegment[] {
  const counts = countByDeviceType(devices);
  return DEVICE_TYPES.filter((t) => counts[t] > 0)
    .map((type) => ({ type, count: counts[type] }))
    .sort(
      (a, b) =>
        b.count - a.count ||
        DEVICE_TYPES.indexOf(a.type) - DEVICE_TYPES.indexOf(b.type),
    );
}
