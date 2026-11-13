import { IOrder } from "@/types/orders";
import { getSubOrders } from "./orderContentLines";

export type DeviceConfig = "intune" | "apple-business-manager";

export const DEVICE_CONFIG_LABEL: Record<DeviceConfig, string> = {
  intune: "Intune",
  "apple-business-manager": "ABM",
};

export const DEVICE_CONFIG_TOOLTIP: Record<DeviceConfig, string> = {
  "apple-business-manager":
    "Enrolled in Apple Business Manager before shipping — supervised, zero-touch configuration on first power-on.",
  intune:
    "Enrolled in Microsoft Intune before shipping — corporate policies, apps, and security baseline pre-installed.",
};

export function normalizeDeviceConfig(
  raw?: string | null,
): DeviceConfig | null {
  const value = (raw ?? "").trim().toLowerCase();
  if (!value || value === "none") return null;
  if (value === "abm" || value.includes("apple")) {
    return "apple-business-manager";
  }
  if (
    value === "mi" ||
    value.includes("intune") ||
    value.includes("microsoft")
  ) {
    return "intune";
  }
  return null;
}

function collectRawConfigs(value: unknown, sink: (raw: string) => void) {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectRawConfigs(entry, sink));
    return;
  }
  if (typeof value === "string") sink(value);
}

export function getOrderDeviceConfigs(order?: IOrder): DeviceConfig[] {
  const found = new Set<DeviceConfig>();
  const add = (raw: string) => {
    const config = normalizeDeviceConfig(raw);
    if (config) found.add(config);
  };

  for (const sub of getSubOrders(order)) {
    const assets = Array.isArray(sub.assets) ? sub.assets : [];
    assets.forEach((asset) =>
      collectRawConfigs(
        (asset as { device_setup?: unknown }).device_setup,
        add,
      ),
    );
    collectRawConfigs(sub.equipment?.device_setup, add);
  }

  const priority: DeviceConfig[] = ["apple-business-manager", "intune"];
  return priority.filter((config) => found.has(config));
}
