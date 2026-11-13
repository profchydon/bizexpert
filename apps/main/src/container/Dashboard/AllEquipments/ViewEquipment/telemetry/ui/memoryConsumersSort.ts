import type { SortDescriptor } from "react-aria-components";
import type { MemoryConsumer } from "../types";

// The natural order is heaviest first, which is what the ranking means, so an unsorted
// descriptor returns the list untouched rather than imposing an alphabetical default.
export function sortConsumers(
  rows: MemoryConsumer[],
  sort: SortDescriptor,
): MemoryConsumer[] {
  if (!sort.column) return rows;
  const dir = sort.direction === "descending" ? -1 : 1;
  const sorted = [...rows];

  sorted.sort((a, b) => {
    switch (sort.column) {
      case "name":
        return a.name.localeCompare(b.name) * dir;
      case "state":
        return (Number(a.runningNow) - Number(b.runningNow)) * dir;
      default:
        // Share and average rank on the same underlying number, because share is that
        // number over a constant. Sorting them differently would be a lie.
        return (a.avgGb - b.avgGb) * dir;
    }
  });

  return sorted;
}
