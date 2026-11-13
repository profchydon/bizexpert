import { Laptop, Monitor, Package, Smartphone } from "lucide-react";
import { defaultDeviceSpecRows } from "./deviceSpecRows";
import type { DeviceEntry, ExtendedSpecRow } from "./types";
export {
  customDeviceSpecificationOptions,
  getAvailableCustomSpecOptions,
  getCustomSpecValueOptions,
  getCustomSpecValuePlaceholder,
} from "./specificationOptions";

function getAssetTypeIcon(assetType: string) {
  const normalizedType = assetType.toLowerCase();

  if (
    normalizedType.includes("laptop") ||
    normalizedType.includes("notebook")
  ) {
    return Laptop;
  }

  if (
    normalizedType.includes("monitor") ||
    normalizedType.includes("display")
  ) {
    return Monitor;
  }

  if (
    normalizedType.includes("phone") ||
    normalizedType.includes("mobile") ||
    normalizedType.includes("tablet")
  ) {
    return Smartphone;
  }

  return Package;
}

function createEmptyDevice(id: string): DeviceEntry {
  return {
    id,
    deviceName: "",
    assetType: "",
    quantity: "",
    budgetPrice: "",
    description: "",
    extendedSpecs: defaultDeviceSpecRows(),
  };
}

function createExtendedSpecRow(existing: ExtendedSpecRow[]): ExtendedSpecRow {
  const rowNumbers = existing
    .map((row) => Number(row.id))
    .filter((rowNumber) => Number.isFinite(rowNumber));
  const nextNumber = rowNumbers.length > 0 ? Math.max(...rowNumbers) + 1 : 1;

  return { id: String(nextNumber), key: "", value: "" };
}

function getPropertyKey(specKey: string) {
  if (specKey === "ram") {
    return "RAM";
  }

  return specKey;
}

function formatRfqDeviceDescription(device: DeviceEntry): string {
  return device.description.trim();
}

function buildRfqDeviceProperties(device: DeviceEntry) {
  return device.extendedSpecs.reduce<Record<string, string>>(
    (properties, spec) => {
      const key = spec.key.trim();
      const value = spec.value.trim();

      if (!key || !value) {
        return properties;
      }

      return { ...properties, [getPropertyKey(key)]: value };
    },
    {},
  );
}

function hasRequiredSpecification(device: DeviceEntry) {
  return device.extendedSpecs.some(
    (spec) => spec.key.trim() && spec.value.trim(),
  );
}

function isDeviceFilled(device: DeviceEntry) {
  return Boolean(
    device.deviceName.trim() &&
    device.assetType &&
    device.quantity &&
    device.description.trim() &&
    hasRequiredSpecification(device),
  );
}

function getDeviceLabel(
  device: DeviceEntry,
  index: number,
  truncateAt: number,
) {
  const name = device.deviceName.trim();
  const truncatedName =
    name.length > truncateAt ? `${name.slice(0, truncateAt)}...` : name;
  const suffix = name ? ` - ${truncatedName}` : "";
  return `Device ${index + 1}${suffix}`;
}

function formatMissingFieldList(fields: string[]) {
  if (fields.length === 0) {
    return "";
  }

  if (fields.length === 1) {
    return fields[0];
  }

  if (fields.length === 2) {
    return `${fields[0]} and ${fields[1]}`;
  }

  return `${fields.slice(0, -1).join(", ")}, and ${fields.at(-1)}`;
}

function getDeviceMissingFieldLabels(device: DeviceEntry) {
  const missing: string[] = [];

  if (!device.deviceName.trim()) {
    missing.push("device name");
  }

  if (!device.assetType) {
    missing.push("asset type");
  }

  if (!device.quantity) {
    missing.push("quantity");
  }

  if (!device.description.trim()) {
    missing.push("description");
  }

  if (!hasRequiredSpecification(device)) {
    missing.push("at least one spec");
  }

  return missing;
}

function getCustomRequestSubmitDisabledReason(devices: DeviceEntry[]) {
  const incompleteDevices = devices
    .map((device, index) => ({
      deviceNumber: index + 1,
      missing: getDeviceMissingFieldLabels(device),
    }))
    .filter((entry) => entry.missing.length > 0);

  if (incompleteDevices.length === 0) {
    return null;
  }

  if (devices.length === 1) {
    return `Add ${formatMissingFieldList(incompleteDevices[0].missing)} to submit.`;
  }

  if (incompleteDevices.length === 1) {
    const { deviceNumber, missing } = incompleteDevices[0];
    return `Add ${formatMissingFieldList(missing)} for Device ${deviceNumber} to submit.`;
  }

  return incompleteDevices
    .map(
      ({ deviceNumber, missing }) =>
        `Device ${deviceNumber}: add ${formatMissingFieldList(missing)}`,
    )
    .join(". ");
}

export {
  buildRfqDeviceProperties,
  createEmptyDevice,
  createExtendedSpecRow,
  formatRfqDeviceDescription,
  getAssetTypeIcon,
  getCustomRequestSubmitDisabledReason,
  getDeviceLabel,
  hasRequiredSpecification,
  isDeviceFilled,
};
