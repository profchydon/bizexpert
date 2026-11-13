export const employeeOverviewSectionOrder = [
  "approvals",
  "catalog-policies",
  "assets",
] as const;

export type EmployeeOverviewSection =
  (typeof employeeOverviewSectionOrder)[number];

export const employeeOverviewCatalogCopy = {
  title: "Catalog",
  description: "Your recent catalog here",
  emptyTitle: "No catalog assigned yet",
  emptyDescription: "You don’t have any catalog assigned to you yet.",
} as const;
