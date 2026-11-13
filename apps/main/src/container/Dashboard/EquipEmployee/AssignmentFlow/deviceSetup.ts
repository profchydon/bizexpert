import { CUSTOM_CONFIG_REQUEST_OPTIONS } from "./customConfigOptions";

export interface SetupDevice {
  name?: string | null;
  type?: string | null;
}

export interface AssetTypeRecord {
  id: string;
  name: string;
}

export type SetupOption = (typeof CUSTOM_CONFIG_REQUEST_OPTIONS)[number];

const ACCESSORIES_TYPE_NAME = "accessories";
const APPLE_RE = /macbook|iphone|ipad|\bapple\b/i;

export function configurableTypeIds(
  assetTypes: AssetTypeRecord[] | undefined,
): Set<string> {
  return new Set(
    (assetTypes ?? [])
      .filter(
        (assetType) =>
          assetType.name.trim().toLowerCase() !== ACCESSORIES_TYPE_NAME,
      )
      .map((assetType) => assetType.id),
  );
}

export function isConfigurableDevice(
  device: SetupDevice,
  configurableTypes: Set<string>,
): boolean {
  return Boolean(device.type) && configurableTypes.has(device.type as string);
}

export function setupOptionsFor(
  device: SetupDevice,
  configurableTypes: Set<string>,
): SetupOption[] {
  if (!isConfigurableDevice(device, configurableTypes)) return [];
  const value = APPLE_RE.test(device.name ?? "") ? "ABM" : "MI";
  return CUSTOM_CONFIG_REQUEST_OPTIONS.filter(
    (option) => option.value === value,
  );
}

export function setupOptionsForAll(
  devices: SetupDevice[],
  configurableTypes: Set<string>,
): SetupOption[] {
  const values = new Set(
    devices.flatMap((device) =>
      setupOptionsFor(device, configurableTypes).map((option) => option.value),
    ),
  );
  return CUSTOM_CONFIG_REQUEST_OPTIONS.filter((option) =>
    values.has(option.value),
  );
}
