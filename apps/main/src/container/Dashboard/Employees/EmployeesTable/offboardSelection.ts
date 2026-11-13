import type { IEmployees } from "@/types/employees";

export type SelectionMap = Record<string, IEmployees>;

export const toggleEmployee = (
  map: SelectionMap,
  employee: IEmployees,
  checked: boolean,
): SelectionMap => {
  const id = employee?.id as string | undefined;
  if (!id) return map;

  if (checked) return { ...map, [id]: employee };
  if (!(id in map)) return map;

  const next = { ...map };
  delete next[id];
  return next;
};

export const togglePage = (
  map: SelectionMap,
  pageEmployees: IEmployees[],
  checked: boolean,
): SelectionMap => {
  const next = { ...map };

  pageEmployees.forEach((employee) => {
    const id = employee?.id as string | undefined;
    if (!id) return;
    if (checked) next[id] = employee;
    else delete next[id];
  });

  return next;
};

export const buildSelectionRecord = (
  map: SelectionMap,
): Record<string, boolean> => {
  const record: Record<string, boolean> = {};
  Object.keys(map).forEach((id) => {
    record[id] = true;
  });
  return record;
};

export const isPageFullySelected = (
  map: SelectionMap,
  pageEmployees: IEmployees[],
): boolean =>
  pageEmployees.length > 0 &&
  pageEmployees.every((employee) => !!employee?.id && employee.id in map);

export const isPagePartiallySelected = (
  map: SelectionMap,
  pageEmployees: IEmployees[],
): boolean =>
  pageEmployees.some((employee) => !!employee?.id && employee.id in map) &&
  !isPageFullySelected(map, pageEmployees);
