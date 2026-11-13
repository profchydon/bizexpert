import type { EquipDeviceItem } from "./equipTypes";

export const collectClaimedStorageIds = (
  itemsByEmployee: Record<string, EquipDeviceItem[]>,
  excludeEmployeeId: string,
  employeeIds: string[],
): Set<string> => {
  const claimed = new Set<string>();
  employeeIds.forEach((employeeId) => {
    if (employeeId === excludeEmployeeId) return;
    (itemsByEmployee[employeeId] ?? []).forEach((item) => {
      if (item.source === "STORAGE" && item.productId) {
        claimed.add(item.productId);
      }
    });
  });
  return claimed;
};
