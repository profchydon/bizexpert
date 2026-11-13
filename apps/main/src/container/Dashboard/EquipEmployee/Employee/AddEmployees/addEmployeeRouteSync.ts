export function buildAddEmployeeRouteQuery(
  values: Record<string, unknown>,
): string {
  const filteredFields = Object.entries(values).filter(
    ([, value]) => value !== "" && value !== undefined && value !== null,
  );

  return new URLSearchParams(
    Object.fromEntries(
      filteredFields.map(([key, value]) => [key, String(value)]),
    ),
  ).toString();
}

export function shouldReplaceAddEmployeeRoute(
  pathname: string,
  currentSearch: string,
  nextQuery: string,
  employeepageInstance: boolean,
): boolean {
  const basePath = employeepageInstance
    ? "/dashboard/employees"
    : "/dashboard/equip-employee/employees";

  if (pathname !== basePath) {
    return true;
  }

  const normalizedCurrent = currentSearch.startsWith("?")
    ? currentSearch.slice(1)
    : currentSearch;

  return normalizedCurrent !== nextQuery;
}
