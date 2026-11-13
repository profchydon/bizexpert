import type { IAddEquipment } from "@/types/equipments";
import {
  isImportPreviewUuid,
  normalizeImportPreviewValue,
} from "./importEquipmentPreviewFormat";

export function assignImportedEquipmentRowId(value: unknown, index: number) {
  const normalized = normalizeImportPreviewValue(value);
  if (
    normalized &&
    !isImportPreviewUuid(normalized) &&
    /^\d+$/.test(normalized)
  ) {
    return Number(normalized);
  }
  return index + 1;
}

export function sanitizeImportedEquipmentSerial(
  serial: unknown,
  rowId: unknown,
) {
  const normalized = normalizeImportPreviewValue(serial);
  if (!normalized) return "";
  if (isImportPreviewUuid(normalized)) return "";
  if (normalizeImportPreviewValue(rowId) === normalized) return "";
  return normalized;
}

export function normalizeImportedEquipmentRow(
  item: IAddEquipment,
  index: number,
) {
  const id = assignImportedEquipmentRowId(item?.id, index);
  const serial_number = sanitizeImportedEquipmentSerial(
    item?.serial_number,
    item?.id,
  );

  return {
    ...item,
    id,
    serial_number,
  };
}
