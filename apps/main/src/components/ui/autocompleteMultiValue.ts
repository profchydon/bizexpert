import type { ReactNode } from "react";

export type AutocompleteSelectOption = {
  value: string;
  label: string;
  icon?: ReactNode;
};

export function buildAutocompleteEmployeeLabel(employee: {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}): string {
  const name =
    `${employee.first_name ?? ""} ${employee.last_name ?? ""}`.trim();
  if (name) {
    return name;
  }

  const email = employee.email?.trim();
  if (email) {
    return email;
  }

  if (employee.id) {
    return `Employee ${String(employee.id).slice(0, 8)}`;
  }

  return "";
}

export function mapEmployeesToAutocompleteOptions(
  employees: Array<{
    id?: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
  }>,
): AutocompleteSelectOption[] {
  const seen = new Set<string>();
  const options: AutocompleteSelectOption[] = [];

  for (const employee of employees) {
    const value = String(employee.id ?? "");
    if (!value || seen.has(value)) {
      continue;
    }

    const label = buildAutocompleteEmployeeLabel(employee);
    if (!label) {
      continue;
    }

    seen.add(value);
    options.push({ value, label });
  }

  return options;
}

export function normalizeMultiSelectValue(
  selected: ReadonlyArray<AutocompleteSelectOption> | null | undefined,
  options: ReadonlyArray<AutocompleteSelectOption>,
): AutocompleteSelectOption[] {
  if (!Array.isArray(selected)) {
    return [];
  }

  const optionByValue = new Map(
    options.map((option) => [String(option.value), option]),
  );
  const seen = new Set<string>();
  const normalized: AutocompleteSelectOption[] = [];

  for (const item of selected) {
    const value = String(item?.value ?? "");
    if (!value || seen.has(value)) {
      continue;
    }

    const matchedOption = optionByValue.get(value);
    const label = (matchedOption?.label ?? item.label ?? "").trim();
    if (!label) {
      continue;
    }

    seen.add(value);
    normalized.push({
      value,
      label,
      icon: item.icon ?? matchedOption?.icon,
    });
  }

  return normalized;
}
