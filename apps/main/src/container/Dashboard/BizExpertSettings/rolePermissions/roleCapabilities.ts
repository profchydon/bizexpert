import type { BusinessRole } from "@/types/bizexpert";
import type { RoleCapability } from "./permissionTypes";

const VIEW: RoleCapability[] = ["view"];
const SELL: RoleCapability[] = ["view", "sell"];
const STOCK: RoleCapability[] = ["view", "stock", "transfer"];
const OPS: RoleCapability[] = [
  "view",
  "sell",
  "stock",
  "transfer",
  "approveStocktake",
  "credit",
  "filterAllUsers",
];
const FULL: RoleCapability[] = [
  "view",
  "sell",
  "stock",
  "transfer",
  "approveStocktake",
  "credit",
  "manageMembers",
  "manageSettings",
  "viewAudit",
  "filterAllUsers",
];

export const ROLE_CAPABILITIES: Record<BusinessRole, RoleCapability[]> = {
  owner: FULL,
  admin: FULL,
  business_manager: OPS,
  store_manager: OPS,
  store_keeper: STOCK,
  waybill_manager: ["view", "transfer"],
  developer: VIEW,
  customer_support: SELL,
  sales_cashier: SELL,
  cashier: SELL,
  accountant: ["view", "credit", "viewAudit"],
};

export function roleHasAllPermissions(role: BusinessRole): boolean {
  return role === "owner" || role === "admin";
}

export function roleHasCapability(
  role: BusinessRole,
  capability: RoleCapability,
): boolean {
  if (roleHasAllPermissions(role)) return true;
  return ROLE_CAPABILITIES[role].includes(capability);
}
