const INTEGRATION_QUERY_KEYS = [
  "integration",
  "integration_id",
  "code",
  "service",
] as const;

export function hasHrisIntegrationQueryParams(
  searchParams: URLSearchParams,
): boolean {
  return INTEGRATION_QUERY_KEYS.some((key) => searchParams.has(key));
}

export function buildHrisTabQueryWithoutIntegrationParams(
  searchParams: URLSearchParams,
): string | null {
  if (!hasHrisIntegrationQueryParams(searchParams)) {
    return null;
  }

  const params = new URLSearchParams(searchParams.toString());

  for (const key of INTEGRATION_QUERY_KEYS) {
    params.delete(key);
  }

  params.set("tab", "hris");
  return params.toString();
}

export function buildEmployeesPath(query: string): string {
  return `/dashboard/employees?${query}`;
}

export function shouldReplaceEmployeesPath(
  currentSearchParams: URLSearchParams,
  nextQuery: string,
): boolean {
  return currentSearchParams.toString() !== nextQuery;
}
