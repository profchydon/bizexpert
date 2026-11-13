export const NO_DEVICE_SETUP = "none";

type SetupChoice = { value: string; label: string };

export function setupPickerItems(options: SetupChoice[]) {
  return [
    { id: NO_DEVICE_SETUP, label: "None" },
    ...options
      .filter((option) => option.value !== NO_DEVICE_SETUP)
      .map((option) => ({ id: option.value, label: option.label })),
  ];
}

export function setupValueFromSelection(key: string | null): string {
  if (!key || key === NO_DEVICE_SETUP) return "";
  return key;
}
