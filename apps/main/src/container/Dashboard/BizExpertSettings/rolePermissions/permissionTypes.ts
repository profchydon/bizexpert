export type RoleCapability =
  | "view"
  | "sell"
  | "stock"
  | "transfer"
  | "approveStocktake"
  | "credit"
  | "manageMembers"
  | "manageSettings"
  | "viewAudit"
  | "filterAllUsers";

export type PermissionGroup =
  | "Inventory Management"
  | "Expense"
  | "Payments"
  | "Loyalty"
  | "Accounting"
  | "Customers"
  | "Settings";

export type RolePermission = {
  id: string;
  label: string;
  group: PermissionGroup;
  capability: RoleCapability | null;
};

export type PermissionRow = [
  id: string,
  label: string,
  capability: RoleCapability | null,
];

export function toPermissions(
  group: PermissionGroup,
  rows: PermissionRow[],
): RolePermission[] {
  return rows.map(([id, label, capability]) => ({
    id,
    label,
    group,
    capability,
  }));
}
