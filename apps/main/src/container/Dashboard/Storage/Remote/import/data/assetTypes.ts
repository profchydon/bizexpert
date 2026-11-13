import type { ComponentType } from "react";
import {
  HardDrive,
  Headphones01,
  Keyboard01,
  Laptop01,
  Lightning01,
  Monitor01,
  Mouse,
  Phone01,
  Tablet01,
  VideoRecorder,
} from "@untitledui/icons";
import type { SelectItemType } from "@/components/base/select/select";
import type { DeviceType } from "../../types/storage";

// Asset types mirror the Marketplace RFQ spec-schema set (these drive which spec
// sheet renders via getSchemaIdForAssetType), plus an "other" catch-all.
export const IMPORT_ASSET_TYPES: SelectItemType[] = [
  { id: "laptop", label: "Laptop" },
  { id: "monitors", label: "Monitor" },
  { id: "phone", label: "Phone" },
  { id: "tablet", label: "Tablet" },
  { id: "keyboard", label: "Keyboard" },
  { id: "mouse", label: "Mouse" },
  { id: "headphones", label: "Headphones" },
  { id: "earpods", label: "Earpods" },
  { id: "webcam", label: "Webcam" },
  { id: "chargers", label: "Charger" },
  { id: "other", label: "Other" },
];

export const ASSET_TYPE_ICONS: Record<
  string,
  ComponentType<{ className?: string }>
> = {
  laptop: Laptop01,
  monitors: Monitor01,
  phone: Phone01,
  tablet: Tablet01,
  keyboard: Keyboard01,
  mouse: Mouse,
  headphones: Headphones01,
  earpods: Headphones01,
  webcam: VideoRecorder,
  chargers: Lightning01,
  other: HardDrive,
};

// Map the spec-schema asset type onto the storage DeviceType taxonomy.
export const ASSET_TO_DEVICE_TYPE: Record<string, DeviceType> = {
  laptop: "Laptop",
  monitors: "Display",
  phone: "Smartphone",
  tablet: "Tablet",
  keyboard: "Input Device",
  mouse: "Input Device",
  headphones: "Audio / Visual",
  earpods: "Audio / Visual",
  webcam: "Audio / Visual",
  chargers: "Power / UPS",
  other: "Accessory",
};
