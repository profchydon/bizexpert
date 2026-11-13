import { createExtendedSpecRow } from "./data";
import type { ExtendedSpecRow } from "./types";
import { addableSpecTypeOptions, specTypeOptions } from "./specTypes";

export function defaultDeviceSpecRows(): ExtendedSpecRow[] {
  return [{ id: "1", key: "condition", value: "" }];
}

export function ensureConditionSpec(rows: ExtendedSpecRow[]) {
  if (rows.some((row) => row.key === "condition")) {
    return rows;
  }

  return [{ id: "0", key: "condition", value: "" }, ...rows];
}

export function getNextAddableSpecKey(usedKeys: string[]) {
  const used = new Set(usedKeys);
  return (
    addableSpecTypeOptions.find((option) => !used.has(option.value))?.value ??
    ""
  );
}

export function canAddMoreSpecs(usedKeys: string[]) {
  return usedKeys.length < specTypeOptions.length;
}

export function addNextDeviceSpecRow(rows: ExtendedSpecRow[]) {
  const nextKey = getNextAddableSpecKey(rows.map((row) => row.key));
  return [...rows, { ...createExtendedSpecRow(rows), key: nextKey }];
}
