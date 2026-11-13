import type { ExtendedSpecRow } from "./types";
import { specSuggestions } from "./specSuggestions";
import {
  addableSpecTypeOptions,
  specTypeLabel,
  specTypeOptions,
} from "./specTypes";

type DeviceSpecificationOption = {
  label: string;
  value: string;
};

const customDeviceSpecificationOptions: DeviceSpecificationOption[] =
  specTypeOptions;

function getCustomSpecLabel(value: string) {
  return specTypeLabel(value);
}

function getCustomSpecValueOptions(specKey: string, currentValue: string) {
  const options = specSuggestions(specKey).map((item) => ({
    label: item.label,
    value: item.label,
  }));

  if (options.length === 0) {
    return [];
  }

  if (
    !currentValue ||
    options.some((option) => option.value === currentValue)
  ) {
    return options;
  }

  return [{ label: currentValue, value: currentValue }, ...options];
}

function getCustomSpecValuePlaceholder(specKey: string) {
  if (specKey === "condition") {
    return "Select condition";
  }

  if (specSuggestions(specKey).length > 0) {
    return "Enter or select value";
  }

  return "Enter value";
}

function getAvailableCustomSpecOptions(
  rows: ExtendedSpecRow[],
  currentKey = "",
) {
  const usedKeys = rows.map((row) => row.key);

  return customDeviceSpecificationOptions.filter(
    (option) => option.value === currentKey || !usedKeys.includes(option.value),
  );
}

export {
  addableSpecTypeOptions,
  customDeviceSpecificationOptions,
  getAvailableCustomSpecOptions,
  getCustomSpecLabel,
  getCustomSpecValueOptions,
  getCustomSpecValuePlaceholder,
  specTypeOptions,
};
