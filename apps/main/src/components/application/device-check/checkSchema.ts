// Asset-type-aware device-check config, mirrored from the Vendor Portal
// (VendorPortal/Orders/data/deviceCheckSchema.ts). It lives here in the shared
// component library so every product can read a device check without importing
// across product containers.

import { resolveCheckAssetLookup } from "./resolveCheckAssetType";

export interface CheckConditionField {
  key: string;
  label: string;
  optional?: boolean;
}

export interface DeviceCheckSchema {
  conditions: CheckConditionField[];
  showPowersOn: boolean;
  requireSerial: boolean;
  minPhotos: number;
  accessories: string[];
}

const LAPTOP: DeviceCheckSchema = {
  conditions: [
    { key: "screen", label: "Screen" },
    { key: "chassis", label: "Chassis" },
    { key: "keyboard", label: "Keyboard" },
    { key: "ports", label: "Ports" },
    { key: "trackpad", label: "Trackpad" },
    { key: "camera", label: "Camera", optional: true },
  ],
  showPowersOn: true,
  requireSerial: true,
  minPhotos: 4,
  accessories: [
    "Charger / power adapter",
    "Charging cable",
    "Carrying case",
    "Dongle / adapter",
    "Original box",
  ],
};

const MONITOR: DeviceCheckSchema = {
  conditions: [
    { key: "screen", label: "Panel" },
    { key: "chassis", label: "Frame" },
    { key: "ports", label: "Ports" },
    { key: "buttons", label: "Buttons", optional: true },
  ],
  showPowersOn: true,
  requireSerial: true,
  minPhotos: 4,
  accessories: [
    "Power adapter",
    "Power cable",
    "Video cable",
    "Stand / mount",
    "Original box",
  ],
};

const PHONE: DeviceCheckSchema = {
  conditions: [
    { key: "screen", label: "Screen" },
    { key: "chassis", label: "Body" },
    { key: "ports", label: "Ports" },
    { key: "buttons", label: "Buttons" },
    { key: "camera", label: "Camera" },
    { key: "speaker", label: "Speaker" },
  ],
  showPowersOn: true,
  requireSerial: true,
  minPhotos: 4,
  accessories: [
    "Charger / power adapter",
    "Charging cable",
    "SIM eject tool",
    "Protective case",
    "Original box",
  ],
};

const TABLET: DeviceCheckSchema = { ...PHONE };

const KEYBOARD: DeviceCheckSchema = {
  conditions: [
    { key: "chassis", label: "Casing" },
    { key: "keyboard", label: "Keys" },
    { key: "ports", label: "Ports", optional: true },
    { key: "cable", label: "Cable", optional: true },
  ],
  showPowersOn: false,
  requireSerial: false,
  minPhotos: 3,
  accessories: [
    "USB receiver",
    "Batteries / charging cable",
    "Wrist rest",
    "Original box",
  ],
};

const HEADPHONES: DeviceCheckSchema = {
  conditions: [
    { key: "chassis", label: "Casing" },
    { key: "ports", label: "Charging port" },
    { key: "buttons", label: "Controls" },
    { key: "speaker", label: "Speakers" },
    { key: "microphone", label: "Microphone", optional: true },
  ],
  showPowersOn: true,
  requireSerial: false,
  minPhotos: 3,
  accessories: [
    "Carrying case",
    "Charging cable",
    "Ear tips",
    "Audio cable",
    "Original box",
  ],
};

const GENERIC: DeviceCheckSchema = {
  conditions: [
    { key: "chassis", label: "Casing" },
    { key: "ports", label: "Ports" },
    { key: "buttons", label: "Controls", optional: true },
  ],
  showPowersOn: true,
  requireSerial: true,
  minPhotos: 3,
  accessories: ["Power adapter", "Power cable", "Original box"],
};

const SCHEMAS: Record<string, DeviceCheckSchema> = {
  laptop: LAPTOP,
  monitors: MONITOR,
  monitor: MONITOR,
  display: MONITOR,
  phone: PHONE,
  tablet: TABLET,
  keyboard: KEYBOARD,
  mouse: KEYBOARD,
  headphones: HEADPHONES,
  earpods: HEADPHONES,
  audio: HEADPHONES,
  other: GENERIC,
};

export function getDeviceCheckSchema(
  assetType: string | undefined | null,
): DeviceCheckSchema {
  return SCHEMAS[resolveCheckAssetLookup(assetType)] ?? GENERIC;
}
