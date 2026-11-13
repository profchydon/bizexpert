export type MemberSortColumn =
  | "name"
  | "role"
  | "dept"
  | "email"
  | "assignedTo"
  | "value"
  | "serial"
  | "";

export interface MemberSort {
  column: MemberSortColumn;
  direction: "asc" | "desc";
}

export function sortEmployees<
  T extends Record<"name" | "role" | "dept" | "email", string>,
>(list: T[], sort: MemberSort): T[] {
  if (!sort.column) return list;
  const key = sort.column;
  if (key !== "name" && key !== "role" && key !== "dept" && key !== "email") {
    return list;
  }
  const dir = sort.direction === "asc" ? 1 : -1;
  return [...list].sort((a, b) => dir * a[key].localeCompare(b[key]));
}

export function sortAssets<
  T extends { name: string; assignedTo: string; value: number },
>(list: T[], sort: MemberSort): T[] {
  if (!sort.column) return list;
  const dir = sort.direction === "asc" ? 1 : -1;
  if (sort.column === "value") {
    return [...list].sort((a, b) => dir * (a.value - b.value));
  }
  const key = sort.column as "name" | "assignedTo";
  return [...list].sort(
    (a, b) => dir * String(a[key]).localeCompare(String(b[key])),
  );
}

export function toggleMemberSort(
  current: MemberSort,
  column: Exclude<MemberSortColumn, "">,
): MemberSort {
  if (current.column !== column) {
    return { column, direction: "asc" };
  }
  return {
    column,
    direction: current.direction === "asc" ? "desc" : "asc",
  };
}
