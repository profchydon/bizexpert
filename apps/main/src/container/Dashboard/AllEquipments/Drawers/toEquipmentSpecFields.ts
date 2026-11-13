import type { ISpecField } from "@/components/MultipleSpecFieldGenerator";
import { DEVICE_SPEC_OPTIONS } from "./deviceSpecification/deviceSpecificationOptions";
import { specTypeLabel } from "./deviceSpecification/specSuggestions";

export type EquipmentSpecProperty = {
  fieldName?: string;
  fieldValue?: string;
};

export const EMPTY_EQUIPMENT_SPEC_FIELDS: ISpecField[] = [];

export const toEquipmentSpecFields = (
  fields: Array<EquipmentSpecProperty | undefined> | undefined,
): ISpecField[] =>
  (fields ?? [])
    .filter((field): field is EquipmentSpecProperty => Boolean(field))
    .map((field) => ({
      fieldName: field.fieldName ?? "",
      fieldValue: field.fieldValue ?? "",
    }));

export const sameEquipmentSpecFields = (
  left: ISpecField[],
  right: ISpecField[],
) =>
  left.length === right.length &&
  left.every(
    (field, index) =>
      field.fieldName === right[index]?.fieldName &&
      field.fieldValue === right[index]?.fieldValue,
  );

export const optionsForEquipmentSpec = (
  specKey: string,
  usedKeys: Set<string>,
) => {
  const base = DEVICE_SPEC_OPTIONS.filter(
    (option) => option.value === specKey || !usedKeys.has(option.value),
  );
  if (specKey && !base.some((option) => option.value === specKey)) {
    return [{ label: specTypeLabel(specKey), value: specKey }, ...base];
  }
  return base;
};
