import type { RFQDevice } from "@/container/Dashboard/Orders/CustomDeviceRequests/types";
import { ensureConditionSpec } from "./deviceSpecRows";
import { specTypeOptions } from "./specTypes";
import type { DeviceEntry, ExtendedSpecRow } from "./types";

function rfqSpecKeyToFormKey(key: string) {
  const trimmed = key.trim();
  if (!trimmed) {
    return "";
  }

  const lower = trimmed.toLowerCase();
  const byValue = specTypeOptions.find(
    (option) => option.value.toLowerCase() === lower,
  );

  if (byValue) {
    return byValue.value;
  }

  const normalized = lower.replaceAll(/\s+/g, "-").replaceAll("_", "-");
  const byNormalized = specTypeOptions.find(
    (option) => option.value === normalized,
  );

  if (byNormalized) {
    return byNormalized.value;
  }

  const byLabel = specTypeOptions.find(
    (option) => option.label.toLowerCase() === lower,
  );

  if (byLabel) {
    return byLabel.value;
  }

  return trimmed.toLowerCase().replaceAll(/\s+/g, "_");
}

function specificationToExtendedSpecs(
  specification?: Record<string, string>,
): ExtendedSpecRow[] {
  if (!specification) {
    return [];
  }

  return Object.entries(specification)
    .filter(([key, value]) => key.trim() && String(value).trim())
    .map(([key, value], index) => ({
      id: String(index + 1),
      key: rfqSpecKeyToFormKey(key),
      value: String(value).trim(),
    }))
    .filter((spec) => spec.key);
}

function formatBudgetPrice(unitPrice?: number) {
  if (unitPrice === undefined || !Number.isFinite(unitPrice)) {
    return "";
  }

  return String(Math.round(unitPrice));
}

export function mapRfqDeviceToDeviceEntry(
  device: RFQDevice,
  id: string,
): DeviceEntry {
  return {
    id,
    deviceName: device.name.trim(),
    assetType: device.assetType,
    quantity: String(device.quantity),
    budgetPrice: formatBudgetPrice(device.unitPrice),
    description: device.description?.trim() ?? "",
    extendedSpecs: ensureConditionSpec(
      specificationToExtendedSpecs(device.specification),
    ),
  };
}

export function mapRfqDevicesToDeviceEntries(devices: RFQDevice[]) {
  if (devices.length === 0) {
    return [];
  }

  return devices.map((device, index) =>
    mapRfqDeviceToDeviceEntry(device, String(index + 1)),
  );
}
