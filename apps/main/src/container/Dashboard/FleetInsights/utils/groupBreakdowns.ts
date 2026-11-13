import type { TelemetryDevice } from "@/types/telemetry";
import { countFailingControls } from "./fleetDeviceRating";
import type { GapDimension } from "./fleetFilters";
import { resolveGroupKey } from "./fleetFilters";

export type GapGroup = {
  key: string;
  label: string;
  deviceCount: number;
  passRate: number;
  healthy: number;
  attention: number;
  critical: number;
  stale: number;
  noAgent: number;
};

export function buildGapGroups(
  devices: TelemetryDevice[],
  dimension: GapDimension,
): GapGroup[] {
  const groups = new Map<string, TelemetryDevice[]>();

  for (const device of devices) {
    const key = resolveGroupKey(device, dimension);
    const bucket = groups.get(key) ?? [];
    bucket.push(device);
    groups.set(key, bucket);
  }

  const rows = [...groups.entries()].map(([key, groupDevices]) => {
    const reporting = groupDevices.filter((device) => device.flags.reporting);
    const passRates = reporting.map((device) => {
      const pass = device.telemetry?.compliance_pass_count ?? 0;
      const fail = device.telemetry?.compliance_fail_count ?? 0;
      const total = pass + fail;
      return total > 0 ? (pass / total) * 100 : 0;
    });
    const passRate =
      passRates.length > 0
        ? passRates.reduce((sum, value) => sum + value, 0) / passRates.length
        : 0;

    return {
      key,
      label: key,
      deviceCount: groupDevices.length,
      passRate,
      healthy: groupDevices.filter(
        (device) => countFailingControls(device) === 0,
      ).length,
      attention: groupDevices.filter(
        (device) => countFailingControls(device) === 1,
      ).length,
      critical: groupDevices.filter(
        (device) => countFailingControls(device) >= 2,
      ).length,
      stale: groupDevices.filter((device) => device.flags.stale).length,
      noAgent: groupDevices.filter((device) => device.flags.no_agent).length,
    };
  });

  return rows.sort((left, right) => left.passRate - right.passRate);
}
