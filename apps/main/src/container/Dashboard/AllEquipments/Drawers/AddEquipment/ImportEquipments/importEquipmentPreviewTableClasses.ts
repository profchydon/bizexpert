import {
  referenceNativeBodyRowClass,
  referenceNativeHeadRowClass,
  referenceNativeTableClass,
} from "@/components/application/table/reference-table-classes";

export const importEquipmentPreviewTableScrollClass =
  "w-full max-w-full min-w-0 overflow-x-auto overscroll-x-contain";

export const importEquipmentPreviewTableShellClass =
  "w-max min-w-full rounded-xl border border-border-secondary bg-primary shadow-xs";

export const importEquipmentPreviewTableClass = `${referenceNativeTableClass} w-full min-w-max table-auto`;

export const importEquipmentPreviewHeadRowClass = referenceNativeHeadRowClass;

export const importEquipmentPreviewBodyRowClass = referenceNativeBodyRowClass;

export const importEquipmentPreviewHeadCellClass =
  "whitespace-nowrap px-3 py-3 text-left text-xs font-medium text-tertiary md:px-4";

export const importEquipmentPreviewBodyCellClass = "px-3 py-4 md:px-4";

export const importEquipmentPreviewActionHeadCellClass = `${importEquipmentPreviewHeadCellClass} sticky right-0 z-[2] bg-secondary`;

export const importEquipmentPreviewActionBodyCellClass = `${importEquipmentPreviewBodyCellClass} sticky right-0 z-[1] shadow-[-4px_0_8px_-4px_rgba(16,24,40,0.08)]`;
