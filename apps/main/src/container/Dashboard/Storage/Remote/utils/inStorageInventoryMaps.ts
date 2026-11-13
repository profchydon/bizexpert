import type {
  DeviceType,
  EntrySource,
  StorageStatus,
  WipeStatus,
} from "../types/storage";

const DEVICE_TYPE_TO_ASSET_TYPE: Partial<Record<DeviceType, string>> = {
  Laptop: "Laptop/Workstation",
  Desktop: "Desktop",
  Smartphone: "Smartphone",
  Tablet: "Tablet",
  Display: "Display",
  "Input Device": "Input Device",
  "Audio / Visual": "Audio / Visual",
  "Docking Station": "Docking Station",
  "Network Infrastructure": "Network Infrastructure",
  "Security Hardware": "Security Hardware",
  "Power / UPS": "Power / UPS",
  Accessory: "Accessory",
};

const ASSET_TYPE_TO_DEVICE_TYPE: Record<string, DeviceType> = {
  "laptop/workstation": "Laptop",
  laptop: "Laptop",
  desktop: "Desktop",
  smartphone: "Smartphone",
  phones: "Smartphone",
  phone: "Smartphone",
  tablet: "Tablet",
  display: "Display",
  monitor: "Display",
  monitors: "Display",
  "input device": "Input Device",
  "audio / visual": "Audio / Visual",
  "audio/visual": "Audio / Visual",
  "docking station": "Docking Station",
  "network infrastructure": "Network Infrastructure",
  "security hardware": "Security Hardware",
  "power / ups": "Power / UPS",
  accessory: "Accessory",
};

const STORAGE_STATUS_TO_UI: Record<string, StorageStatus> = {
  in_storage: "available",
  available: "available",
  pending_device_check: "pending_check",
  pending_check: "pending_check",
  reserved: "reserved",
  deploying: "reserved",
  in_transit: "in_transit",
  pending_disposal: "pending_disposal",
  disposed: "disposed",
  donated: "donated",
};

const UI_STATUS_TO_API: Partial<Record<StorageStatus | "all", string>> = {
  available: "in_storage",
  pending_check: "pending_device_check",
};

const WIPE_STATUS_TO_UI: Record<string, WipeStatus> = {
  wiped: "wiped",
  completed: "wiped",
  not_wiped: "not_wiped",
  new: "new",
};

const VALID_SOURCES: EntrySource[] = [
  "offboarding",
  "open_fleet",
  "buy_to_storage",
  "repair_return",
  "loaner_return",
];

function normalizeInventoryKey(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "object") {
    const record = value as { status?: unknown; label?: unknown };
    return normalizeInventoryKey(record.status ?? record.label);
  }
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

export function mapAssetTypeToDeviceType(assetType: string): DeviceType {
  return (
    ASSET_TYPE_TO_DEVICE_TYPE[assetType.trim().toLowerCase()] ?? "Accessory"
  );
}

export function mapDeviceTypeToAssetType(deviceType: DeviceType): string {
  return DEVICE_TYPE_TO_ASSET_TYPE[deviceType] ?? deviceType;
}

export function mapStorageStatus(
  status: unknown,
  label?: string | null,
): StorageStatus {
  return (
    STORAGE_STATUS_TO_UI[normalizeInventoryKey(status)] ??
    STORAGE_STATUS_TO_UI[normalizeInventoryKey(label)] ??
    "available"
  );
}

export function mapUiStatusToApi(
  status: StorageStatus | "all",
): string | undefined {
  if (status === "all") return undefined;
  return UI_STATUS_TO_API[status];
}

export function mapWipeStatus(status: unknown): WipeStatus | undefined {
  if (status == null || status === "") return undefined;
  if (typeof status === "object") {
    const wipe = status as {
      required?: boolean;
      status?: string | null;
      label?: string | null;
    };
    if (wipe.required === false) return undefined;
    return mapWipeStatus(wipe.status ?? wipe.label);
  }
  const key = normalizeInventoryKey(status);
  if (key === "not_required") return undefined;
  return WIPE_STATUS_TO_UI[key];
}

export function mapUiWipeToApi(wipe: WipeStatus | "all"): string | undefined {
  if (wipe === "all") return undefined;
  return wipe;
}

export function mapSource(source: string): EntrySource {
  return VALID_SOURCES.includes(source as EntrySource)
    ? (source as EntrySource)
    : "buy_to_storage";
}

export function mapSortColumn(column: string | number): string | undefined {
  const key = String(column);
  if (key === "entry") return "entry_date";
  if (key === "device") return "title";
  if (key === "country") return "country";
  if (key === "entity") return "entity";
  if (key === "grade") return "grade";
  if (key === "status") return "storage_status";
  return undefined;
}
