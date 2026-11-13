import type { IEmployees } from "@/types/employees";

export function mergeEmployeePages(
  existing: IEmployees[],
  incoming: IEmployees[],
  page: number,
): IEmployees[] {
  if (page <= 1) return incoming;

  const ids = new Set(existing.map((employee) => String(employee.id)));
  return [
    ...existing,
    ...incoming.filter((employee) => !ids.has(String(employee.id))),
  ];
}
