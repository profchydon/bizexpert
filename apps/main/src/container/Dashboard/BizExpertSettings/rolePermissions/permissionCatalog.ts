import { INVENTORY_PERMISSIONS } from "./inventoryPermissions";
import {
  ACCOUNTING_PERMISSIONS,
  CUSTOMERS_PERMISSIONS,
  EXPENSE_PERMISSIONS,
  LOYALTY_PERMISSIONS,
  PAYMENTS_PERMISSIONS,
  SETTINGS_PERMISSIONS,
} from "./otherPermissions";
import type { PermissionGroup, RolePermission } from "./permissionTypes";

export const ROLE_PERMISSIONS: RolePermission[] = [
  ...INVENTORY_PERMISSIONS,
  ...EXPENSE_PERMISSIONS,
  ...PAYMENTS_PERMISSIONS,
  ...LOYALTY_PERMISSIONS,
  ...ACCOUNTING_PERMISSIONS,
  ...CUSTOMERS_PERMISSIONS,
  ...SETTINGS_PERMISSIONS,
];

export const PERMISSION_GROUP_ORDER: PermissionGroup[] = [
  "Inventory Management",
  "Expense",
  "Payments",
  "Loyalty",
  "Accounting",
  "Customers",
  "Settings",
];

export function groupPermissions(
  rows: RolePermission[],
): Array<{ group: PermissionGroup; items: RolePermission[] }> {
  return PERMISSION_GROUP_ORDER.map((group) => ({
    group,
    items: rows.filter((row) => row.group === group),
  })).filter((entry) => entry.items.length > 0);
}
