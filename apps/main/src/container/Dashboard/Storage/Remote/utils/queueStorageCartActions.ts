import type { BulkRecipient } from "../components/BulkActionsModal";
import type { Recipient } from "../components/deploy/types";
import type { DeviceActionKind } from "../data/deviceActions";
import type { CheckoutItem } from "../hooks/useStorageCheckout";
import type { DisposalMethod, StoredDevice } from "../types/storage";
import { isDeviceAlreadyErased } from "./isDeviceAlreadyErased";

const BULK_DEVICE_CHECK_REASON = "Bulk re-grade check";

function newStorageCartItemId() {
  return `chk-${crypto.randomUUID()}`;
}

function storageCartItemBase(device: StoredDevice) {
  return {
    id: newStorageCartItemId(),
    deviceId: device.id,
    deviceName: device.deviceName,
    serialNumber: device.serialNumber,
    country: device.country,
    assetType: device.assetType,
    image: device.image,
  };
}

export function toDeployCartItem(
  device: StoredDevice,
  recipient: Recipient,
  wipeRequested?: boolean,
): CheckoutItem {
  return {
    ...storageCartItemBase(device),
    kind: "deployment",
    employeeId: recipient.id,
    recipientName: recipient.name,
    recipientCountry: recipient.country,
    wipeRequested,
  };
}

export function toDisposeCartItem(
  device: StoredDevice,
  method: DisposalMethod,
): CheckoutItem {
  return {
    ...storageCartItemBase(device),
    kind: "disposal",
    erasureWaived: isDeviceAlreadyErased(device),
    disposalMethod: method,
  };
}

export function toDeviceCheckCartItem(
  device: StoredDevice,
  reason: string,
  neededBy?: string,
): CheckoutItem {
  const checkReason = reason.trim() || "Re-grade check";
  const checkNote = [checkReason, neededBy ? `needed by ${neededBy}` : ""]
    .filter(Boolean)
    .join(" · ");

  return {
    ...storageCartItemBase(device),
    kind: "device_check",
    checkNote,
    checkReason,
    neededBy,
  };
}

function bulkCheckFields(kind: DeviceActionKind) {
  if (kind !== "device_check") return {};
  return {
    checkNote: BULK_DEVICE_CHECK_REASON,
    checkReason: BULK_DEVICE_CHECK_REASON,
  };
}

function bulkWipeRequested(
  kind: DeviceActionKind,
  device: StoredDevice,
  wipeSelections?: Record<string, boolean>,
) {
  if (kind !== "deployment" || device.wipeStatus !== "not_wiped") {
    return undefined;
  }
  return wipeSelections?.[device.id] ?? false;
}

export function toBulkCartItems(
  kind: DeviceActionKind,
  devices: StoredDevice[],
  recipients?: Record<string, BulkRecipient>,
  disposalMethod?: DisposalMethod,
  wipeSelections?: Record<string, boolean>,
): CheckoutItem[] {
  return devices.map((device) => ({
    ...storageCartItemBase(device),
    kind,
    employeeId: recipients?.[device.id]?.id,
    recipientName: recipients?.[device.id]?.name,
    recipientCountry: recipients?.[device.id]?.country,
    erasureWaived:
      kind === "disposal" ? isDeviceAlreadyErased(device) : undefined,
    disposalMethod: kind === "disposal" ? disposalMethod : undefined,
    ...bulkCheckFields(kind),
    wipeRequested: bulkWipeRequested(kind, device, wipeSelections),
  }));
}
