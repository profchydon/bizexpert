import type { IInStorageInventoryAction } from "@/types/equipmentsInStorageInventory";
import type { DeviceActionKind } from "../data/deviceActions";

const API_ACTION_TO_KIND: Record<string, DeviceActionKind> = {
  storage_device_check: "device_check",
  storage_disposal: "disposal",
  storage_deploy_to_employee: "deployment",
};

const KIND_ORDER: DeviceActionKind[] = [
  "deployment",
  "device_check",
  "disposal",
];

export function mapInventoryAvailableActions(
  available?: string[] | null,
  actions?: IInStorageInventoryAction[] | null,
): DeviceActionKind[] | undefined {
  if (Array.isArray(available)) {
    return kindsFromTypes(available);
  }
  if (Array.isArray(actions)) {
    return kindsFromTypes(
      actions.filter((item) => item.allowed).map((item) => item.type),
    );
  }
  return undefined;
}

function kindsFromTypes(types: string[]): DeviceActionKind[] {
  const seen = new Set<DeviceActionKind>();
  for (const type of types) {
    const kind = API_ACTION_TO_KIND[type];
    if (kind) seen.add(kind);
  }
  return KIND_ORDER.filter((kind) => seen.has(kind));
}
