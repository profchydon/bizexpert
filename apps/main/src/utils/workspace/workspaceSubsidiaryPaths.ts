const WORKSPACE_SUBSIDIARY_SCOPED_PATHS = [
  "/employees",
  "/equipments",
  "/dashboard",
  "/orders",
  "/catalogs",
  "/catalog-policies",
  "/kits",
  "/rfqs",
  "/country-summary",
  "/asset-refresh",
  "/departments",
  "/levels",
  "/job-titles",
  "/offices",
  "/offboard",
  "/carts",
  "/fees",
  "/assets",
] as const;

const WORKSPACE_SUBSIDIARY_EXCLUDED_PATHS = [
  "/settings/",
  "/transactions",
  "/onboarding/",
  "/integrations",
  "/entities",
  "/api-keys",
  "/mcp-credentials",
  "/agreement",
  "/wallet",
  "/join-requests",
  "/subscriptions",
] as const;

const EMPLOYEE_SELF_RESOURCE_PATH =
  /\/employees\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(?:\/|\?|$)/;

export function isEmployeeSelfResourcePath(url: string): boolean {
  return EMPLOYEE_SELF_RESOURCE_PATH.test(url);
}

export function shouldAttachWorkspaceSubsidiaryParam(url: string): boolean {
  if (isEmployeeSelfResourcePath(url)) {
    return false;
  }

  if (
    WORKSPACE_SUBSIDIARY_EXCLUDED_PATHS.some((segment) => url.includes(segment))
  ) {
    return false;
  }

  return WORKSPACE_SUBSIDIARY_SCOPED_PATHS.some((segment) =>
    url.includes(segment),
  );
}
