import type { TelemetryDevice } from "@/types/telemetry";
import {
  countFailingControls,
  isCriticalDevice,
  resolveDeviceRating,
} from "./fleetDeviceRating";

export type FleetListFilter =
  | { kind: "tile"; tile: FleetStatTileId }
  | { kind: "insight"; insightId: string; deviceIds: string[] }
  | { kind: "control"; controlKey: string; segment: "fail" | "unknown" }
  | { kind: "group"; dimension: GapDimension; groupKey: string }
  | { kind: "os"; osKey: string };

export type FleetStatTileId =
  | "reporting"
  | "critical"
  | "needs_attention"
  | "stale"
  | "restart_overdue"
  | "no_agent";

export type GapDimension = "entity" | "office" | "os" | "ownership";

export function filterLabel(filter: FleetListFilter, count: number): string {
  if (filter.kind === "tile") {
    const labels: Record<FleetStatTileId, string> = {
      reporting: "Devices reporting",
      critical: "Critical devices",
      needs_attention: "Devices needing attention",
      stale: "Stale devices",
      restart_overdue: "Restart overdue devices",
      no_agent: "Devices without an agent",
    };
    return `${labels[filter.tile]}, ${count} device${count === 1 ? "" : "s"}`;
  }
  if (filter.kind === "insight") return `Insight filter, ${count} devices`;
  if (filter.kind === "control") {
    return `${filter.controlKey} ${filter.segment}, ${count} devices`;
  }
  if (filter.kind === "group") {
    return `${filter.groupKey} (${filter.dimension}), ${count} devices`;
  }
  return `${filter.osKey} devices, ${count} devices`;
}

export function deviceMatchesControlFilter(
  device: TelemetryDevice,
  controlKey: string,
  segment: "fail" | "unknown",
): boolean {
  const normalizedKey = normalizeControlKey(controlKey);
  const result = device.telemetry?.compliance_results?.find(
    (entry) => normalizeControlKey(entry.check_id) === normalizedKey,
  );
  if (!result) return segment === "unknown";
  return result.status === segment;
}

export function normalizeControlKey(key: string): string {
  const normalized = key.toLowerCase();
  if (normalized.includes("encrypt")) return "disk_encryption";
  if (normalized.includes("screen")) return "screen_lock";
  if (normalized === "encryption") return "disk_encryption";
  if (normalized === "screenlock") return "screen_lock";
  return normalized;
}

export function isRestartOverdue(device: TelemetryDevice): boolean {
  const days = device.telemetry?.days_since_restart;
  return typeof days === "number" && days >= 14;
}

export function hasRestartData(devices: TelemetryDevice[]): boolean {
  return devices.some(
    (device) =>
      device.telemetry?.days_since_restart != null ||
      device.telemetry?.last_restart_at != null,
  );
}

export function applyFleetListFilter(
  devices: TelemetryDevice[],
  filter: FleetListFilter | null,
): TelemetryDevice[] {
  if (!filter) return devices;

  if (filter.kind === "tile") {
    switch (filter.tile) {
      case "reporting":
        return devices.filter((device) => device.flags.reporting);
      case "critical":
        return devices.filter(isCriticalDevice);
      case "needs_attention":
        return devices.filter((device) => countFailingControls(device) > 0);
      case "stale":
        return devices.filter((device) => device.flags.stale);
      case "restart_overdue":
        return devices.filter(isRestartOverdue);
      case "no_agent":
        return devices.filter((device) => device.flags.no_agent);
      default:
        return devices;
    }
  }

  if (filter.kind === "insight") {
    return devices.filter((device) =>
      filter.deviceIds.includes(device.equipment_id),
    );
  }

  if (filter.kind === "control") {
    return devices.filter((device) =>
      deviceMatchesControlFilter(device, filter.controlKey, filter.segment),
    );
  }

  if (filter.kind === "group") {
    return devices.filter(
      (device) => resolveGroupKey(device, filter.dimension) === filter.groupKey,
    );
  }

  if (filter.kind === "os") {
    return devices.filter(
      (device) => (device.telemetry?.os_name ?? "Unknown") === filter.osKey,
    );
  }

  return devices;
}

export function resolveGroupKey(
  device: TelemetryDevice,
  dimension: GapDimension,
): string {
  if (dimension === "entity") return device.company_id || "Unknown entity";
  if (dimension === "office") return device.office_id || "Unassigned office";
  if (dimension === "os") return device.telemetry?.os_name ?? "Unknown OS";
  return device.owner_type ?? "Unknown ownership";
}

export function resolveDeviceRatingLabel(device: TelemetryDevice): string {
  const rating = resolveDeviceRating(device);
  if (rating === "critical") return "Critical";
  if (rating === "attention") return "Needs attention";
  if (rating === "unconfirmed") return "Unconfirmed";
  return "Healthy";
}
