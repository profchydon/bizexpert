import type { DeviceConfig, EquipDeviceItem } from "./equipTypes";

export const DEVICE_CONFIG_OPTIONS: { value: DeviceConfig; label: string }[] = [
  { value: "MI", label: "Microsoft Intune" },
  { value: "ABM", label: "Apple Business Manager" },
  { value: "none", label: "None" },
];

const CONFIG_LABELS: Record<DeviceConfig, string> = {
  MI: "Intune",
  ABM: "ABM",
  none: "None",
};

const CONFIGURABLE_CATEGORIES = new Set([
  "Laptop",
  "Desktop",
  "Smartphone",
  "Tablet",
  "Macbook",
  "Workstation",
  "Computer",
  "Phone",
  "Phones",
]);

const APPLE_RE = /apple|macbook|imac|mac\s*mini|iphone|ipad|ipod|airpods/i;
const PC_RE =
  /dell|lenovo|hp|asus|acer|microsoft|surface|thinkpad|elitebook|latitude|xps/i;

export const getDeviceConfigLabel = (config: DeviceConfig): string =>
  CONFIG_LABELS[config];

export const isDeviceConfigurable = (
  item: Pick<EquipDeviceItem, "category">,
): boolean =>
  Boolean(item.category && CONFIGURABLE_CATEGORIES.has(item.category));

const configFromName = (name: string): DeviceConfig => {
  if (APPLE_RE.test(name)) return "ABM";
  if (PC_RE.test(name)) return "MI";
  return "none";
};

export const getDefaultDeviceConfig = (
  item: Pick<EquipDeviceItem, "name" | "category">,
): DeviceConfig => {
  if (!isDeviceConfigurable(item)) return "none";
  return configFromName(item.name);
};

export const getStorageDefaultConfig = (name: string): DeviceConfig =>
  configFromName(name);
