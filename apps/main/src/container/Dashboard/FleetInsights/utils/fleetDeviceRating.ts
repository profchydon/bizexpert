import type { TelemetryDevice } from "@/types/telemetry";

export type DeviceRating = "healthy" | "unconfirmed" | "attention" | "critical";

export function countFailingControls(device: TelemetryDevice): number {
  const telemetry = device.telemetry;
  if (!telemetry) return 0;
  if (typeof telemetry.compliance_fail_count === "number") {
    return telemetry.compliance_fail_count;
  }
  return (
    telemetry.compliance_results?.filter((result) => result.status === "fail")
      .length ?? 0
  );
}

export function countUnknownControls(device: TelemetryDevice): number {
  const results = device.telemetry?.compliance_results ?? [];
  return results.filter((result) => result.status === "unknown").length;
}

export function resolveDeviceRating(device: TelemetryDevice): DeviceRating {
  if (
    device.flags.no_agent ||
    device.flags.revoked ||
    !device.flags.reporting
  ) {
    return "unconfirmed";
  }
  const failing = countFailingControls(device);
  if (failing >= 2) return "critical";
  if (failing === 1) return "attention";
  if (countUnknownControls(device) > 0) return "unconfirmed";
  return "healthy";
}

export function isCriticalDevice(device: TelemetryDevice): boolean {
  return resolveDeviceRating(device) === "critical";
}

export function deviceRatingSortWeight(device: TelemetryDevice): number {
  if (device.flags.no_agent) return 0;
  if (device.flags.stale) return 1;
  const rating = resolveDeviceRating(device);
  if (rating === "critical") return 4;
  if (rating === "attention") return 3;
  if (rating === "unconfirmed") return 2;
  return 1;
}

export function sortDevicesWorstFirst(
  devices: TelemetryDevice[],
): TelemetryDevice[] {
  return [...devices].sort((left, right) => {
    const weightDiff =
      deviceRatingSortWeight(right) - deviceRatingSortWeight(left);
    if (weightDiff !== 0) return weightDiff;
    return countFailingControls(right) - countFailingControls(left);
  });
}
