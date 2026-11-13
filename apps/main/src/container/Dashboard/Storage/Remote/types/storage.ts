import type { Grade } from "@/components/application/device-check/types";
import type { SpecValues } from "@/lib/spec-schema";

// Re-exported so the existing consumers across Storage keep importing these from here.
export type {
  AccessoryItem,
  ConditionRating,
  DeviceCheckReport,
  Grade,
} from "@/components/application/device-check/types";

export type StorageStatus =
  | "pending_check"
  | "available"
  | "reserved"
  | "in_transit"
  | "pending_disposal"
  | "disposed"
  | "donated";

export type EntrySource =
  | "offboarding"
  | "open_fleet"
  | "buy_to_storage"
  | "repair_return"
  | "loaner_return";

// Whether the device's data was erased before it entered storage. Maps from the
// offboarding wipe choice: "None" ⇒ "not_wiped" (the client kept the data — it may
// still hold company data); "Full Factory Reset" / "Full Disk Erase" ⇒ "wiped";
// buy_to_storage ⇒ "new" (never assigned, nothing to wipe). Omitted ⇒ the asset has
// no data storage (monitors, keyboards, docks) and no wipe concept applies.
export type WipeStatus = "wiped" | "not_wiped" | "new";

// How a disposed device is retired: erased + donated via the Impact Program, or
// physically destroyed with a certificate of destruction.
export type DisposalMethod = "donate" | "destroy";

// Canonical device/asset-type taxonomy (see CLAUDE.md). Kept as a const array so the
// inventory filter can list every type, not just the ones currently in the table.
export const DEVICE_TYPES = [
  "Laptop",
  "Desktop",
  "Smartphone",
  "Tablet",
  "Display",
  "Input Device",
  "Audio / Visual",
  "Docking Station",
  "Network Infrastructure",
  "Security Hardware",
  "Power / UPS",
  "Accessory",
] as const;

export type DeviceType = (typeof DEVICE_TYPES)[number];

export interface StoredDevice {
  id: string;
  deviceName: string;
  model: string;
  deviceType: DeviceType;
  assetType: string;
  serialNumber: string;
  image?: string;
  country: string;
  countryId?: string;
  countryCode?: string;
  entityId?: string;
  entityName?: string;
  warehouse: string;
  entrySource: EntrySource;
  sourceLabel?: string;
  storageStatusLabel?: string;
  sourceOrderId?: string;
  sourceOrderNumber?: string;
  wipeStatus?: WipeStatus;
  wipeLabel?: string;
  entryDate: string;
  daysInStorage?: number;
  status: StorageStatus;
  grade?: Grade;
  gradeLabel?: string;
  lastCheckDate?: string;
  checkedDaysAgo?: number | null;
  gradeSynthetic?: boolean;
  needsActionFlag?: boolean;
  valuation?: number;
  currency: string;
  specs?: SpecValues;
  extendedSpecs?: { key: string; value: string }[];
  availableActions?: Array<"deployment" | "device_check" | "disposal">;
}

export interface TimelineEvent {
  id: string;
  label: string;
  detail?: string;
  at: string;
}

export type RequestKind =
  "deployment" | "device_check" | "disposal" | "open_fleet_import";
export type RequestStatus =
  "requested" | "in_progress" | "completed" | "action_required" | "cancelled";

export interface StorageRequest {
  id: string;
  kind: RequestKind;
  status: RequestStatus;
  deviceId?: string;
  deviceName: string;
  serialNumber?: string;
  assetType?: string;
  image?: string;
  country: string;
  createdAt: string;
  note?: string;
  importId?: string;
  recipientName?: string;
  recipientCountry?: string;
}

// Statuses for devices physically at rest in storage. Devices in motion
// (reserved/in_transit/pending_disposal) and terminal ones (disposed/donated)
// live on the Orders tab, not the Inventory table.
export const IN_STORAGE_STATUSES: StorageStatus[] = [
  "available",
  "pending_check",
];

// Unified order view-model: every device movement in/out of storage plus
// in-flight service. Derived from StorageRequest records and synthesized
// device intakes — see utils/buildStorageOrders.ts.
export type OrderDirection = "inbound" | "outbound" | "service";
export type OrderKind = RequestKind | "intake";

export interface StorageOrder {
  id: string;
  orderNumber?: string;
  kind: OrderKind;
  direction: OrderDirection;
  status: RequestStatus;
  statusLabel?: string;
  deviceId?: string;
  deviceName: string;
  serialNumber?: string;
  assetType?: string;
  image?: string;
  country: string;
  countryCode?: string;
  createdAt: string;
  note?: string;
  importId?: string;
  recipientName?: string;
  recipientCountry?: string;
  entrySource?: EntrySource;
  sourceOrderId?: string;
  flowLabel?: string;
  directionLabel?: string;
  quantity?: number;
  orderedBy?: string;
  device?: StoredDevice;
}

export interface DonatedDevice {
  id: string;
  deviceName: string;
  deviceType: DeviceType;
  country: string;
  recipient: string;
  recipientType: "ngo" | "school" | "individual";
  transferDate: string;
  ewasteKg: number;
}

// Inventory filter shape lives in ./filters. Re-exported so existing Storage
// consumers keep importing it from this module.
export { INITIAL_FILTERS, type InventoryFilters } from "./filters";
