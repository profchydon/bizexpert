import type { TelemetryDevice } from "@/types/telemetry";

export type OsSegment = {
  key: string;
  label: string;
  count: number;
  behindCount: number;
  color: string;
};

const OS_COLORS = [
  "var(--color-utility-brand-600)",
  "var(--color-utility-blue-600)",
  "var(--color-utility-purple-600)",
  "var(--color-utility-orange-600)",
  "var(--color-utility-gray-500)",
];

export function buildOsSegments(devices: TelemetryDevice[]): OsSegment[] {
  const reporting = devices.filter((device) => device.flags.reporting);
  const groups = new Map<string, TelemetryDevice[]>();

  for (const device of reporting) {
    const key = device.telemetry?.os_name ?? "Unknown";
    const bucket = groups.get(key) ?? [];
    bucket.push(device);
    groups.set(key, bucket);
  }

  return [...groups.entries()].map(([key, groupDevices], index) => ({
    key,
    label: key,
    count: groupDevices.length,
    behindCount: groupDevices.filter((device) =>
      Boolean(device.telemetry?.compliance_fail_count),
    ).length,
    color: OS_COLORS[index % OS_COLORS.length],
  }));
}

export function restartMedianDays(devices: TelemetryDevice[]): number | null {
  const values = devices
    .map((device) => device.telemetry?.days_since_restart)
    .filter((value): value is number => typeof value === "number")
    .sort((left, right) => left - right);

  if (values.length === 0) return null;
  const mid = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    return Math.round((values[mid - 1] + values[mid]) / 2);
  }
  return values[mid];
}
