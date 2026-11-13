import type { Office } from "../../types";

export type OfficeSortKey = "name" | "subsidiary" | "region" | "type";

export interface OfficeSort {
  column: OfficeSortKey | "";
  direction: "asc" | "desc";
}

export function toggleOfficeSort(
  current: OfficeSort,
  column: OfficeSortKey,
): OfficeSort {
  if (current.column !== column) {
    return { column, direction: "asc" };
  }
  return {
    column,
    direction: current.direction === "asc" ? "desc" : "asc",
  };
}

export function filterOffices(
  list: Office[],
  query: string,
  types: Office["type"][],
): Office[] {
  const normalized = query.trim().toLowerCase();
  return list.filter(
    (office) =>
      (types.length === 0 || types.includes(office.type)) &&
      (!normalized ||
        office.name.toLowerCase().includes(normalized) ||
        office.subsidiaryName.toLowerCase().includes(normalized) ||
        office.region.toLowerCase().includes(normalized)),
  );
}

export function sortOffices(list: Office[], sort: OfficeSort): Office[] {
  if (!sort.column) return list;
  const dir = sort.direction === "asc" ? 1 : -1;
  const key = sort.column === "subsidiary" ? "subsidiaryName" : sort.column;
  return [...list].sort(
    (a, b) => dir * String(a[key]).localeCompare(String(b[key])),
  );
}
