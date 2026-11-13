export type EquipmentDeviceStatus = "active" | "inactive";

const TELEMETRY_TYPES = new Set([
  "computer",
  "laptop/workstation",
  "laptop",
  "phone",
  "phones",
  "smartphone",
  "tablet",
]);

export const equipmentHasTelemetry = (type?: string | null) => {
  if (!type) return false;
  return TELEMETRY_TYPES.has(type.toLowerCase());
};

export const deriveEquipmentDeviceStatus = (
  status?: string | null,
): EquipmentDeviceStatus => {
  const normalized = (status ?? "").toLowerCase().replace(/\s+/g, "_");
  if (["assigned", "active", "leased"].includes(normalized)) return "active";
  return "inactive";
};

export const EQUIPMENT_DEVICE_STATUS_LABEL: Record<
  EquipmentDeviceStatus,
  string
> = {
  active: "Active",
  inactive: "Inactive",
};

export const EQUIPMENT_DEVICE_STATUS_DOT: Record<
  EquipmentDeviceStatus,
  string
> = {
  active: "bg-success-500",
  inactive: "bg-gray-400",
};

export const EQUIPMENT_DEVICE_STATUS_TOOLTIP: Record<
  EquipmentDeviceStatus,
  string
> = {
  active: "Checked in within the last 7 days — online and in use.",
  inactive: "No recent check-in — idle, in storage, or powered off.",
};
