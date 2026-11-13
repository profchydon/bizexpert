import type { Selection } from "react-aria-components";
import type { IEquipment } from "@/types/equipments";
import { isDispositionEquipment as isEquipmentDispositionEligible } from "../employeeEquipmentDisposition";

export const isSelectableEquipment = (equipment: IEquipment): boolean =>
  Boolean(equipment.id);

export const isDispositionEquipment = (equipment: IEquipment): boolean =>
  isEquipmentDispositionEligible(equipment);

export const getSelectedRowCount = (
  selected: Selection,
  rows: IEquipment[],
): number => {
  if (selected === "all") {
    return rows.filter(isDispositionEquipment).length;
  }
  if (!selected || selected.size === 0) {
    return 0;
  }
  return getDispositionDeviceIds(rows, selected).length;
};

export const getSelectedDeviceIds = (
  rows: IEquipment[],
  selected: Selection,
): string[] => {
  if (selected === "all") {
    return rows.filter(isSelectableEquipment).map((row) => String(row.id));
  }
  if (!selected || selected.size === 0) {
    return [];
  }
  return Array.from(selected, String);
};

export const getDispositionDeviceIds = (
  rows: IEquipment[],
  selected: Selection,
): string[] => {
  const keys = getSelectedDeviceIds(rows, selected);

  return rows
    .filter(
      (item) =>
        item.id &&
        keys.includes(String(item.id)) &&
        isDispositionEquipment(item),
    )
    .map((item) => String(item.id));
};
