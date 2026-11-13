import type { FC } from "react";
import {
  LogOut01,
  RefreshCcw01,
  ShoppingCart01,
  Tool01,
  UploadCloud01,
} from "@untitledui/icons";
import type { SelectItemType } from "@/components/base/select/select";
import { cx } from "@/utils/cx";
import type { StorageCountryOption } from "../types/inventoryApi";
import { resolveCountryFlag } from "./resolveCountryFlag";
import { DEVICE_TYPE_ICON } from "../data/deviceTypeMeta";
import { SOURCE_LABEL, STATUS_LABEL, WIPE_LABEL } from "../data/storageMeta";
import type {
  DeviceType,
  EntrySource,
  Grade,
  StorageStatus,
  WipeStatus,
} from "../types/storage";
import { STATUS_BAR_CLASS } from "./statusBar";

// A leading "icon" that is just a colored dot. Defined as an FC (not a ReactNode)
// so the Select renders it in both the dropdown list and the trigger value.
const dot = (className: string): FC =>
  function Dot() {
    return <span className={cx("size-2 shrink-0 rounded-full", className)} />;
  };

// Terminal statuses (disposed/donated) never appear in the inventory table —
// disposed devices are gone and donated ones live in the Impact tab.
const IN_STORAGE_STATUSES = (
  Object.keys(STATUS_LABEL) as StorageStatus[]
).filter((s) => s !== "disposed" && s !== "donated");

export const STATUS_ITEMS: SelectItemType[] = [
  { id: "all", label: "All statuses" },
  ...IN_STORAGE_STATUSES.map((s) => ({
    id: s,
    label: STATUS_LABEL[s],
    icon: dot(STATUS_BAR_CLASS[s]),
  })),
];

const SOURCE_ICON: Record<EntrySource, FC<{ className?: string }>> = {
  offboarding: LogOut01,
  open_fleet: UploadCloud01,
  buy_to_storage: ShoppingCart01,
  repair_return: Tool01,
  loaner_return: RefreshCcw01,
};

export const SOURCE_ITEMS: SelectItemType[] = [
  { id: "all", label: "All sources" },
  ...(Object.keys(SOURCE_LABEL) as EntrySource[]).map((s) => ({
    id: s,
    label: SOURCE_LABEL[s],
    icon: SOURCE_ICON[s],
  })),
];

export function countryItems(
  options: StorageCountryOption[],
): SelectItemType[] {
  return [
    { id: "all", label: "All countries" },
    ...options.map((c) => ({
      id: c.id,
      label: c.name,
      icon: resolveCountryFlag(c.code, c.name).Flag,
    })),
  ];
}

// Only the asset types passed in (those present in the inventory) are selectable.
export function deviceTypeItems(types: DeviceType[]): SelectItemType[] {
  return [
    { id: "all", label: "All asset types" },
    ...types.map((t) => ({ id: t, label: t, icon: DEVICE_TYPE_ICON[t] })),
  ];
}

const WIPE_DOT_CLASS: Record<WipeStatus, string> = {
  wiped: "bg-utility-success-500",
  not_wiped: "bg-utility-orange-500",
  new: "bg-utility-blue-500",
};

export const WIPE_ITEMS: SelectItemType[] = [
  { id: "all", label: "All wipe statuses" },
  ...(Object.keys(WIPE_LABEL) as WipeStatus[]).map((w) => ({
    id: w,
    label: WIPE_LABEL[w],
    icon: dot(WIPE_DOT_CLASS[w]),
  })),
];

export const GRADE_OPTIONS: { id: string; label: string; grade?: Grade }[] = [
  { id: "all", label: "All grades" },
  { id: "A", label: "A · Excellent", grade: "A" },
  { id: "B", label: "B · Good", grade: "B" },
  { id: "C", label: "C · Fair", grade: "C" },
  { id: "D", label: "D · Poor", grade: "D" },
];
