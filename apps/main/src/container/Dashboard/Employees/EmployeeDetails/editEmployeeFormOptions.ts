import type { SelectItemType } from "@/components/base/select/select";
import { removeUserscore } from "@/utils/underScoreTransformer";

export const EMPLOYMENT_TYPE_OPTIONS: SelectItemType[] = [
  "Contract",
  "Part_Time",
  "Full_Time",
  "Others",
].map((value) => ({
  id: value,
  label: removeUserscore(value),
}));

export function withCurrentSelectOption(
  options: SelectItemType[],
  value: string,
  label?: string,
): SelectItemType[] {
  if (!value) {
    return options;
  }

  const displayLabel = label?.trim();
  const existing = options.find((option) => option.id === value);
  if (existing) {
    if (displayLabel && (!existing.label?.trim() || existing.label === value)) {
      return options.map((option) =>
        option.id === value ? { ...option, label: displayLabel } : option,
      );
    }
    return options;
  }

  return [...options, { id: value, label: displayLabel || value }];
}

export function toSelectItems(
  options: { value: string; label: string }[] = [],
): SelectItemType[] {
  return options.map((option) => ({
    id: option.value,
    label: option.label,
  }));
}

export function toCountrySelectItems(
  options: { value: string; label: string }[] = [],
): SelectItemType[] {
  return options.map((option) => ({
    id: option.label,
    label: option.label,
  }));
}

export const ADDRESS_LOCK_TOOLTIP =
  "Address and country cannot be changed while this employee has an order in progress.";
