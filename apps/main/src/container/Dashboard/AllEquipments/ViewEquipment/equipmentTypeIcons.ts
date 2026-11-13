import type { FC } from "react";
import {
  Laptop01,
  Monitor01,
  Package,
  Phone01,
  Tablet01,
} from "@untitledui/icons";

export const EQUIPMENT_TYPE_ICON: Record<string, FC<{ className?: string }>> = {
  phone: Phone01,
  "laptop/workstation": Laptop01,
  laptop: Laptop01,
  computer: Laptop01,
  macbook: Laptop01,
  tablet: Tablet01,
  monitor: Monitor01,
  display: Monitor01,
  accessories: Package,
};

export const getEquipmentTypeIcon = (type?: string) => {
  const key = (type ?? "").toLowerCase();
  return EQUIPMENT_TYPE_ICON[key] ?? Laptop01;
};
