export interface DevicePreviewItem {
  id: string;
  title: string;
  imageUrl: string | null;
}

export interface DevicePreview {
  items: DevicePreviewItem[];
  visibleCount: number;
  extraCount: number;
  count: number;
}

export const MAX_VISIBLE_DEVICES = 3;

type EmployeeEquipment = {
  id?: string | null;
  title?: string | null;
  image_url?: string | null;
};

export type DeviceSource = {
  equipment?: EmployeeEquipment[] | null;
  equipment_count?: number | null;
};

export const getEmployeeDevicePreview = (
  row?: DeviceSource | null,
  maxVisible: number = MAX_VISIBLE_DEVICES,
): DevicePreview => {
  const equipmentList = row?.equipment;
  const equipment = Array.isArray(equipmentList) ? equipmentList : [];

  const rawCount =
    typeof row?.equipment_count === "number" ? row.equipment_count : 0;
  const count = Math.max(rawCount, equipment.length, 0);

  const items: DevicePreviewItem[] = equipment
    .slice(0, maxVisible)
    .map((device, index) => ({
      id: device?.id ?? `device-${index}`,
      title: device?.title ?? "Device",
      imageUrl: device?.image_url ?? null,
    }));

  const visibleCount =
    items.length > 0 ? items.length : Math.min(count, maxVisible);
  const extraCount = Math.max(count - visibleCount, 0);

  return { items, visibleCount, extraCount, count };
};

export const hasAssignedDevices = (row?: DeviceSource | null): boolean =>
  getEmployeeDevicePreview(row).count > 0;

export const getOffboardEligibility = <T>(rows: T[]) => {
  const offboardableRows = rows.filter((row) =>
    hasAssignedDevices(row as unknown as DeviceSource),
  );
  const excludedCount = rows.length - offboardableRows.length;

  return {
    offboardableRows,
    excludedCount,
    canOffboard: rows.length > 0 && excludedCount === 0,
  };
};
