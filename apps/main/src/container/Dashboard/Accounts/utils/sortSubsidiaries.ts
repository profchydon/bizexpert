import type {
  SortDirection,
  Subsidiary,
  SubsidiarySort,
  SubsidiaryStatus,
} from "../types";

export function filterSubsidiaries(
  list: Subsidiary[],
  query: string,
  statuses: SubsidiaryStatus[],
): Subsidiary[] {
  const normalizedQuery = query.trim().toLowerCase();
  return list.filter((subsidiary) => {
    const matchesQuery =
      !normalizedQuery ||
      subsidiary.name.toLowerCase().includes(normalizedQuery) ||
      subsidiary.region.toLowerCase().includes(normalizedQuery);
    const matchesStatus =
      statuses.length === 0 || statuses.includes(subsidiary.status);
    return matchesQuery && matchesStatus;
  });
}

const primaryFirst = (a: Subsidiary, b: Subsidiary) =>
  Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary));

export function sortSubsidiaries(
  list: Subsidiary[],
  sort: SubsidiarySort,
): Subsidiary[] {
  if (!sort.column) return [...list].sort(primaryFirst);

  const direction = sort.direction === "asc" ? 1 : -1;
  return [...list].sort((a, b) => {
    const primary = primaryFirst(a, b);
    if (primary !== 0) return primary;

    switch (sort.column) {
      case "name":
        return direction * a.name.localeCompare(b.name);
      case "region":
        return direction * a.region.localeCompare(b.region);
      case "currency":
        return direction * a.currency.localeCompare(b.currency);
      case "offices":
        return direction * (a.officesCount - b.officesCount);
      case "status":
        return direction * a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
}

export function toggleSort(
  current: SubsidiarySort,
  column: SubsidiarySort["column"],
): SubsidiarySort {
  if (current.column !== column) {
    return { column, direction: "asc" };
  }
  return {
    column,
    direction: current.direction === "asc" ? "desc" : "asc",
  };
}

export function sortDirectionLabel(direction: SortDirection): "asc" | "desc" {
  return direction;
}

export function paginateSubsidiaries(
  list: Subsidiary[],
  page: number,
  perPage: number,
) {
  const total = list.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(page, 1), lastPage);
  const start = (safePage - 1) * perPage;

  return {
    items: list.slice(start, start + perPage),
    total,
    lastPage,
  };
}
