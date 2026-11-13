import type { FC } from "react";
import { PackageCheck, Trash02, Truck01 } from "@untitledui/icons";
import type { StorageStatus, StoredDevice } from "../types/storage";

export type DeviceActionKind = "deployment" | "device_check" | "disposal";

export type DeviceActionSource = Pick<StoredDevice, "status"> & {
  availableActions?: DeviceActionKind[];
};

export const ACTION_META: Record<
  DeviceActionKind,
  {
    label: string;
    icon: FC<{ className?: string }>;
    color: "primary" | "secondary" | "secondary-destructive";
  }
> = {
  deployment: { label: "Deploy to employee", icon: Truck01, color: "primary" },
  device_check: {
    label: "Request device check",
    icon: PackageCheck,
    color: "secondary",
  },
  disposal: {
    label: "Request disposal",
    icon: Trash02,
    color: "secondary-destructive",
  },
};

const ACTIONS_BY_STATUS: Record<StorageStatus, DeviceActionKind[]> = {
  available: ["deployment", "device_check", "disposal"],
  pending_check: [],
  reserved: [],
  in_transit: [],
  pending_disposal: [],
  disposed: [],
  donated: [],
};

export function availableActions(
  device: DeviceActionSource,
): DeviceActionKind[] {
  if (device.availableActions !== undefined) return device.availableActions;
  return ACTIONS_BY_STATUS[device.status] ?? [];
}

export function canOfferDeviceCheck(device: DeviceActionSource): boolean {
  return availableActions(device).includes("device_check");
}

export function canQueueDeviceCheck(
  device: DeviceActionSource,
  alreadyInProgress: boolean,
): boolean {
  return canOfferDeviceCheck(device) && !alreadyInProgress;
}

export function devicesForBulkAction<T extends DeviceActionSource>(
  devices: T[],
  kind: DeviceActionKind,
): T[] {
  return devices.filter((device) => availableActions(device).includes(kind));
}

export function mergeDeviceActions(
  listed: StoredDevice,
  detailed?: StoredDevice,
): StoredDevice {
  const device = detailed ?? listed;
  return {
    ...device,
    availableActions: detailed?.availableActions ?? listed.availableActions,
  };
}
