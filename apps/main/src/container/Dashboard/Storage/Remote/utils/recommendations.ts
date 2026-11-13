import { type DeviceActionKind, availableActions } from "../data/deviceActions";
import { type CustomerPlan, planAllowsBuyback } from "../data/plans";
import type { RequestKind, StoredDevice } from "../types/storage";
import { daysInStorage, freshnessTier } from "./deriveDevice";

export interface RecAction {
  label: string;
  kind: RequestKind;
}

export interface Recommendation {
  id: string;
  title: string;
  body: string;
  device: StoredDevice;
  actions: RecAction[];
}

export interface RecLayoutProps {
  recommendations: Recommendation[];
  readOnly?: boolean;
  onAction: (kind: RequestKind, device: StoredDevice) => void;
  onView: (device: StoredDevice) => void;
  onDismiss: (id: string) => void;
}

const DEPLOY: RecAction = { label: "Deploy", kind: "deployment" };
const CHECK: RecAction = { label: "Request a check", kind: "device_check" };
const DISPOSE: RecAction = { label: "Request disposal", kind: "disposal" };

function allowedRecActions(
  device: StoredDevice,
  actions: RecAction[],
): RecAction[] {
  const kinds = new Set(availableActions(device));
  return actions.filter((action) => kinds.has(action.kind as DeviceActionKind));
}

/** Proactive storage recommendations derived from inventory (doc §8). Capped to the top few. */
export function buildRecommendations(
  devices: StoredDevice[],
  plan: CustomerPlan,
): Recommendation[] {
  const live = devices.filter(
    (d) => d.status !== "disposed" && d.status !== "donated",
  );
  const recs: Recommendation[] = [];

  // One suggestion per qualifying inventory device, by priority (most urgent first).
  for (const d of live) {
    if (d.status === "pending_check") {
      recs.push({
        id: `pending:${d.id}`,
        device: d,
        title: "Awaiting device check",
        body: `${d.deviceName} is waiting for an inspection. The grade appears once the check is complete.`,
        actions: [],
      });
    } else if (d.status === "available" && d.wipeStatus === "not_wiped") {
      const actions = allowedRecActions(d, [DEPLOY]);
      if (actions.length === 0) continue;
      recs.push({
        id: `wipe:${d.id}`,
        device: d,
        title: "Contains company data",
        body: `${d.deviceName} was stored without a wipe. Deploying it will offer a factory reset before it ships to a new employee.`,
        actions,
      });
    } else if (
      d.status === "available" &&
      freshnessTier(d) === "very_stale" &&
      availableActions(d).includes("device_check")
    ) {
      recs.push({
        id: `stale:${d.id}`,
        device: d,
        title: "Stale device check",
        body: `${d.deviceName} was last checked over 180 days ago. Refresh its grade before deploying.`,
        actions: [CHECK],
      });
    } else if (
      d.status === "available" &&
      (d.grade === "C" || d.grade === "D") &&
      planAllowsBuyback(plan)
    ) {
      const actions = allowedRecActions(d, [DISPOSE]);
      if (actions.length === 0) continue;
      recs.push({
        id: `buyback:${d.id}`,
        device: d,
        title: "Recover value before it drops",
        body: `${d.deviceName} (Grade ${d.grade}) is a buyback candidate. Disposal presents a buyback quote for eligible plans.`,
        actions,
      });
    } else if (d.status === "available" && daysInStorage(d) > 90) {
      const actions = allowedRecActions(d, [DEPLOY, CHECK, DISPOSE]);
      if (actions.length === 0) continue;
      recs.push({
        id: `idle:${d.id}`,
        device: d,
        title: "Device idle in storage",
        body: `${d.deviceName} has been in storage for ${daysInStorage(d)} days. Deploy it, request a check to refresh its value, or dispose of it.`,
        actions,
      });
    }
  }

  const byCountry = new Map<string, StoredDevice[]>();
  for (const d of live)
    if (d.grade === "D" && d.status === "available")
      byCountry.set(d.country, [...(byCountry.get(d.country) ?? []), d]);
  const batch = [...byCountry.entries()].find(([, list]) => list.length >= 2);
  if (batch && availableActions(batch[1][0]).includes("disposal"))
    recs.push({
      id: `batch:${batch[0]}`,
      device: batch[1][0],
      title: "Batch disposal saves on handling",
      body: `You have ${batch[1].length} end-of-life devices in ${batch[0]}. Dispose of them together to reduce per-device erasure handling.`,
      actions: [DISPOSE],
    });

  return recs.slice(0, 8);
}
