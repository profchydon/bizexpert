import type { TelemetryDevice } from "@/types/telemetry";
import { countFailingControls } from "./fleetDeviceRating";
import { resolveGroupKey } from "./fleetFilters";

export type FleetInsight = {
  id: string;
  title: string;
  description: string;
  deviceIds: string[];
  filterId: string;
};

export const INSIGHT_LIMIT = 6;
export const MIN_GROUP = 2;
export const MIN_GAP = 5;

export function buildFleetInsights(devices: TelemetryDevice[]): FleetInsight[] {
  const reporting = devices.filter((device) => device.flags.reporting);
  const insights: FleetInsight[] = [];

  const multiFail = reporting.filter(
    (device) => countFailingControls(device) >= 2,
  );
  if (multiFail.length > 0) {
    insights.push({
      id: "multi-fail",
      title: `${multiFail.length} device${multiFail.length === 1 ? "" : "s"} failing two or more controls`,
      description:
        "Prioritize remediation on devices with multiple failing checks.",
      deviceIds: multiFail.map((device) => device.equipment_id),
      filterId: `insight:multi-fail:${multiFail.map((device) => device.equipment_id).join(",")}`,
    });
  }

  const encryptionOff = reporting.filter((device) =>
    device.telemetry?.compliance_results?.some(
      (result) =>
        result.check_id.includes("encryption") && result.status === "fail",
    ),
  );
  if (encryptionOff.length > 0) {
    insights.push({
      id: "encryption-off",
      title: `${encryptionOff.length} device${encryptionOff.length === 1 ? "" : "s"} without disk encryption`,
      description:
        "Encryption is off on reporting devices across Windows (BitLocker) and macOS (FileVault).",
      deviceIds: encryptionOff.map((device) => device.equipment_id),
      filterId: `insight:encryption:${encryptionOff.map((device) => device.equipment_id).join(",")}`,
    });
  }

  const stale = devices.filter((device) => device.flags.stale);
  if (stale.length > 0) {
    insights.push({
      id: "stale",
      title: `${stale.length} device${stale.length === 1 ? "" : "s"} stale for 7+ days`,
      description:
        "These devices have not reported telemetry or agent heartbeat recently.",
      deviceIds: stale.map((device) => device.equipment_id),
      filterId: `insight:stale:${stale.map((device) => device.equipment_id).join(",")}`,
    });
  }

  const noAgent = devices.filter((device) => device.flags.no_agent);
  if (noAgent.length > 0) {
    insights.push({
      id: "no-agent",
      title: `${noAgent.length} device${noAgent.length === 1 ? "" : "s"} without an active agent`,
      description:
        "Install the Rayda agent to start collecting fleet telemetry.",
      deviceIds: noAgent.map((device) => device.equipment_id),
      filterId: `insight:no-agent:${noAgent.map((device) => device.equipment_id).join(",")}`,
    });
  }

  const overallPassRate = averagePassRate(reporting);
  const entityGroups = groupBy(reporting, (device) =>
    resolveGroupKey(device, "entity"),
  );
  for (const [entityKey, groupDevices] of Object.entries(entityGroups)) {
    if (groupDevices.length < MIN_GROUP) continue;
    const groupRate = averagePassRate(groupDevices);
    if (overallPassRate - groupRate >= MIN_GAP) {
      insights.push({
        id: `entity-gap-${entityKey}`,
        title: `${entityKey} is ${Math.round(overallPassRate - groupRate)} points below fleet average`,
        description:
          "This entity has the largest compliance gap versus the overall fleet.",
        deviceIds: groupDevices.map((device) => device.equipment_id),
        filterId: `insight:entity:${entityKey}:${groupDevices.map((device) => device.equipment_id).join(",")}`,
      });
      break;
    }
  }

  return insights.slice(0, INSIGHT_LIMIT);
}

function averagePassRate(devices: TelemetryDevice[]): number {
  if (devices.length === 0) return 0;
  const rates = devices.map((device) => {
    const pass = device.telemetry?.compliance_pass_count ?? 0;
    const fail = device.telemetry?.compliance_fail_count ?? 0;
    const total = pass + fail;
    if (total === 0) return 0;
    return (pass / total) * 100;
  });
  return rates.reduce((sum, value) => sum + value, 0) / rates.length;
}

function groupBy<T>(
  items: T[],
  selector: (item: T) => string,
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const key = selector(item);
    groups[key] = groups[key] ?? [];
    groups[key].push(item);
    return groups;
  }, {});
}
