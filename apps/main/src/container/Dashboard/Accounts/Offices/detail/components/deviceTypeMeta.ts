import {
  Cpu,
  Headphones,
  KeyRound,
  Laptop,
  Monitor,
  Mouse,
  Package,
  Plug,
  Router,
  Shield,
  Smartphone,
  Tablet,
  Zap,
} from "lucide-react";
import type { DeviceType } from "../../types/officeAsset";

export const DEVICE_TYPE_BAR_CLASS: Record<DeviceType, string> = {
  Laptop: "bg-primary-500",
  Desktop: "bg-primary-700",
  Smartphone: "bg-orange",
  Tablet: "bg-primary-300",
  Display: "bg-success-700",
  "Input Device": "bg-purple-700",
  "Audio / Visual": "bg-error-400",
  "Docking Station": "bg-primary-800",
  "Network Infrastructure": "bg-success-500",
  "Security Hardware": "bg-error-500",
  "Power / UPS": "bg-amber",
  Accessory: "bg-gray-500",
};

export const DEVICE_TYPE_ICON: Record<DeviceType, typeof Laptop> = {
  Laptop,
  Desktop: Cpu,
  Smartphone,
  Tablet,
  Display: Monitor,
  "Input Device": Mouse,
  "Audio / Visual": Headphones,
  "Docking Station": Plug,
  "Network Infrastructure": Router,
  "Security Hardware": Shield,
  "Power / UPS": Zap,
  Accessory: KeyRound,
};

const SERVER_TYPE_ALIAS: Record<string, DeviceType> = {
  "laptop/workstation": "Laptop",
  macbook: "Laptop",
  imac: "Desktop",
  monitor: "Display",
  phones: "Smartphone",
  accessories: "Accessory",
  tablet: "Tablet",
};

export function resolveDeviceType(type: string): DeviceType | undefined {
  if (type in DEVICE_TYPE_BAR_CLASS) return type as DeviceType;
  return SERVER_TYPE_ALIAS[type.trim().toLowerCase()];
}

export const FALLBACK_DEVICE_BAR_CLASS = "bg-gray-500";

export function deviceTypeBarClass(type: string): string {
  const resolved = resolveDeviceType(type);
  return resolved ? DEVICE_TYPE_BAR_CLASS[resolved] : FALLBACK_DEVICE_BAR_CLASS;
}

export function deviceTypeIcon(type: string): typeof Laptop {
  const resolved = resolveDeviceType(type);
  return resolved ? DEVICE_TYPE_ICON[resolved] : Package;
}

export const ASSET_MIX_PALETTE = [
  "bg-primary-500",
  "bg-success-500",
  "bg-orange",
  "bg-purple-700",
  "bg-error-400",
  "bg-primary-800",
  "bg-amber",
  "bg-success-700",
  "bg-primary-300",
  "bg-error-500",
  "bg-primary-700",
  "bg-gray-500",
];

export function assetMixColorClasses(types: string[]): Map<string, string> {
  const assigned = new Map<string, string>();
  const used = new Set<string>();

  for (const type of types) {
    if (assigned.has(type)) continue;
    const resolved = resolveDeviceType(type);
    const canonical = resolved ? DEVICE_TYPE_BAR_CLASS[resolved] : undefined;
    if (canonical && !used.has(canonical)) {
      assigned.set(type, canonical);
      used.add(canonical);
    }
  }

  for (const type of types) {
    if (assigned.has(type)) continue;
    const color =
      ASSET_MIX_PALETTE.find((entry) => !used.has(entry)) ??
      ASSET_MIX_PALETTE[assigned.size % ASSET_MIX_PALETTE.length];
    assigned.set(type, color);
    used.add(color);
  }

  return assigned;
}
