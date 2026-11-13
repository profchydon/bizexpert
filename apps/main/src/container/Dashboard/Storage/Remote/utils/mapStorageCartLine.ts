import type {
  StorageCartActionType,
  StorageCartLine,
} from "@/api/baseQueries/cartApi/cartLineTypes";
import type { DeviceActionKind } from "../data/deviceActions";
import type { CheckoutItem } from "../hooks/useStorageCheckout";
import type { DisposalMethod } from "../types/storage";
import { storageCartEmployeeName } from "./storageDeployRecipient";

const EMPTY_LABEL = {
  deviceName: "Storage action",
  serialNumber: "",
  country: "",
};

function nameAndSerial(middle: string) {
  const hashIndex = middle.lastIndexOf("#");
  if (hashIndex < 0) {
    return { deviceName: middle, serialNumber: "" };
  }
  return {
    deviceName: middle.slice(0, hashIndex).trim(),
    serialNumber: middle.slice(hashIndex + 1).trim(),
  };
}

export function parseStorageCartLabel(label: string | undefined) {
  if (!label?.trim()) return EMPTY_LABEL;

  const parts = label
    .replaceAll("—", "-")
    .replaceAll("–", "-")
    .split(" - ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 3) {
    const country = parts.at(-1) ?? "";
    const middle = parts.slice(1, -1).join(" - ");
    return { ...nameAndSerial(middle), country };
  }

  if (parts.length === 2) {
    return {
      deviceName: parts[1] ?? parts[0] ?? "",
      serialNumber: "",
      country: "",
    };
  }

  return { deviceName: label.trim(), serialNumber: "", country: "" };
}

function disposalMethodOf(line: StorageCartLine): DisposalMethod | undefined {
  if (line.disposal_method === "destroy" || line.disposal_method === "donate") {
    return line.disposal_method;
  }
  return undefined;
}

function checkoutKindOf(type: StorageCartActionType): DeviceActionKind {
  if (type === "storage_disposal") return "disposal";
  if (type === "storage_deploy_to_employee") return "deployment";
  return "device_check";
}

export function mapStorageCartLineToCheckoutItem(
  line: StorageCartLine,
): CheckoutItem {
  const parsed = parseStorageCartLabel(line.label);
  const deviceId = line.equipment_id ?? line.equipment?.id ?? "";

  return {
    id: line.id ?? deviceId,
    kind: checkoutKindOf(line.type),
    deviceId,
    deviceName: line.equipment?.title ?? parsed.deviceName,
    serialNumber: line.equipment?.serial_number ?? parsed.serialNumber,
    country: line.equipment?.country ?? parsed.country,
    assetType: line.equipment?.type ?? "",
    checkNote: line.reason,
    checkReason: line.reason,
    neededBy: line.needed_by,
    companyId: line.company_id,
    employeeId: line.employee_id ?? line.employee?.id,
    recipientName: storageCartEmployeeName(line.employee),
    recipientCountry: line.employee?.country,
    disposalMethod: disposalMethodOf(line),
    currency: line.currency,
  };
}
