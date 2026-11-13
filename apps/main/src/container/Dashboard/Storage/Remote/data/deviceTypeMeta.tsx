import type { FC } from "react";
import {
  HardDrive,
  Headphones01,
  Keyboard01,
  Laptop01,
  Lightning01,
  Monitor01,
  Monitor04,
  Package,
  Phone01,
  Shield01,
  Tablet01,
  Wifi,
} from "@untitledui/icons";
import type { DeviceType } from "../types/storage";

// Single source of truth for per-asset-type visuals (icon, light tint chip, solid bar
// colour). Shared by the inventory filter and the asset-type overview section.

export const DEVICE_TYPE_ICON: Record<
  DeviceType,
  FC<{ className?: string }>
> = {
  Laptop: Laptop01,
  Desktop: Monitor04,
  Smartphone: Phone01,
  Tablet: Tablet01,
  Display: Monitor01,
  "Input Device": Keyboard01,
  "Audio / Visual": Headphones01,
  "Docking Station": HardDrive,
  "Network Infrastructure": Wifi,
  "Security Hardware": Shield01,
  "Power / UPS": Lightning01,
  Accessory: Package,
};

/** Solid utility-token background for stacked-bar segments and legend dots. */
export const DEVICE_TYPE_BAR_CLASS: Record<DeviceType, string> = {
  Laptop: "bg-utility-brand-500",
  Desktop: "bg-utility-indigo-500",
  Smartphone: "bg-utility-orange-500",
  Tablet: "bg-utility-blue-light-500",
  Display: "bg-utility-success-500",
  "Input Device": "bg-utility-purple-500",
  "Audio / Visual": "bg-utility-pink-500",
  "Docking Station": "bg-utility-gray-blue-500",
  "Network Infrastructure": "bg-utility-emerald-500",
  "Security Hardware": "bg-utility-error-500",
  "Power / UPS": "bg-utility-yellow-500",
  Accessory: "bg-utility-gray-500",
};
