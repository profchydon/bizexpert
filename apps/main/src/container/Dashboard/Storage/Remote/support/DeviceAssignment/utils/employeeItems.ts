import type { SelectItemType } from "@/components/base/select/select";
import type { Employee } from "../../Employees/data/dummy-employees";

export interface EmployeeGroup {
  country: string;
  items: SelectItemType[];
}

function toItem(emp: Employee): SelectItemType {
  const countryKey =
    typeof emp.country === "string"
      ? emp.country
      : (emp.country as any)?.name || String(emp.country || "");
  return {
    id: emp.id,
    label: emp.name,
    initials: emp.initials,
    supportingText: countryKey,
  };
}

function hasEmployeesInCountry(
  countryLabel: string,
  employees: Employee[],
): boolean {
  return employees.some((employee) => {
    const countryKey =
      typeof employee.country === "string"
        ? employee.country
        : (employee.country as any)?.name || String(employee.country || "");
    return countryKey === countryLabel;
  });
}

function buildSortedEmployeeItems(
  deviceCountry: string,
  employees: Employee[],
  options: { allowCrossCountryFallback?: boolean } = {},
): SelectItemType[] {
  // No device country (e.g. a bulk selection spanning countries) means there are no
  // local matches — fall through to the cross-country fallback rather than bailing early,
  // otherwise the picker renders empty and no employee can be selected.
  const localEmployees = deviceCountry
    ? employees
        .filter((employee) => {
          const countryKey =
            typeof employee.country === "string"
              ? employee.country
              : (employee.country as any)?.name ||
                String(employee.country || "");
          return countryKey === deviceCountry;
        })
        .map(toItem)
    : [];
  if (localEmployees.length > 0) return localEmployees;
  if (options.allowCrossCountryFallback) return employees.map(toItem);
  return [];
}

// Every employee, grouped by country for divider rendering: the device's country
// group first, then the rest alphabetically; employees within each group are sorted
// alphabetically by name.
function buildEmployeeGroups(
  deviceCountry: string,
  employees: Employee[],
): EmployeeGroup[] {
  const byCountry = new Map<string, SelectItemType[]>();
  for (const emp of [...employees].sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const countryKey =
      typeof emp.country === "string"
        ? emp.country
        : (emp.country as any)?.name || String(emp.country || "");
    const list = byCountry.get(countryKey) ?? [];
    list.push(toItem(emp));
    byCountry.set(countryKey, list);
  }

  const countries = [...byCountry.keys()].sort((a, b) => a.localeCompare(b));
  const ordered =
    deviceCountry && byCountry.has(deviceCountry)
      ? [deviceCountry, ...countries.filter((c) => c !== deviceCountry)]
      : countries;

  return ordered.map((country) => ({
    country,
    items: byCountry.get(country)!,
  }));
}

export { buildSortedEmployeeItems, buildEmployeeGroups, hasEmployeesInCountry };
