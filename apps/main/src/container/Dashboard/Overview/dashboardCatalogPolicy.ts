import type { IDashboard } from "@/types/dashboard";

export function dashboardCatalogPolicySummary(dashboard?: IDashboard | null) {
  const panel = dashboard?.panels?.catalog_policy;

  return {
    coveredCount: panel?.employee_coverage.covered ?? 0,
    employeeCount: panel?.employee_coverage.total ?? 0,
    activeCount: panel?.policy_status.active ?? 0,
    inactiveCount: panel?.policy_status.draft ?? 0,
    kitCount: panel?.kits_assigned ?? 0,
    visible: dashboard?.access?.visibility?.catalog_policy !== false,
  };
}
