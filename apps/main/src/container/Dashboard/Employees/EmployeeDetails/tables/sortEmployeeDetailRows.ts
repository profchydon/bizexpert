import type { SortDescriptor } from "react-aria-components";

export function sortEmployeeDetailRows<T>(
  rows: T[],
  sort: SortDescriptor,
  getSortValue: (row: T, column: string) => string | number,
): T[] {
  if (!sort.column) return rows;
  const dir = sort.direction === "ascending" ? 1 : -1;
  return [...rows].sort((left, right) => {
    const leftValue = getSortValue(left, String(sort.column));
    const rightValue = getSortValue(right, String(sort.column));
    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return (leftValue - rightValue) * dir;
    }
    return (
      String(leftValue).localeCompare(String(rightValue), undefined, {
        numeric: true,
      }) * dir
    );
  });
}
