import { BusinessRole } from "./enums";

export const ROLES_THAT_CAN_MANAGE_MEMBERS: BusinessRole[] = [
  BusinessRole.OWNER,
  BusinessRole.ADMIN,
];

export const ROLES_THAT_CAN_MANAGE_SETTINGS: BusinessRole[] = [
  BusinessRole.OWNER,
  BusinessRole.ADMIN,
];

export const ROLES_THAT_CAN_APPROVE_STOCKTAKE: BusinessRole[] = [
  BusinessRole.OWNER,
  BusinessRole.ADMIN,
  BusinessRole.BUSINESS_MANAGER,
  BusinessRole.STORE_MANAGER,
];

export const ROLES_THAT_BYPASS_LOCATION: BusinessRole[] = [
  BusinessRole.OWNER,
  BusinessRole.ADMIN,
  BusinessRole.BUSINESS_MANAGER,
  BusinessRole.STORE_MANAGER,
];

export const ROLES_THAT_CAN_SELL: BusinessRole[] = [
  BusinessRole.OWNER,
  BusinessRole.ADMIN,
  BusinessRole.BUSINESS_MANAGER,
  BusinessRole.STORE_MANAGER,
  BusinessRole.CUSTOMER_SUPPORT,
  BusinessRole.SALES_CASHIER,
  BusinessRole.CASHIER,
];

export function isProtectedOwnerRole(role: BusinessRole): boolean {
  return role === BusinessRole.OWNER;
}

export function canManageMembers(role: BusinessRole): boolean {
  return ROLES_THAT_CAN_MANAGE_MEMBERS.includes(role);
}

export function canManageSettings(role: BusinessRole): boolean {
  return ROLES_THAT_CAN_MANAGE_SETTINGS.includes(role);
}

export function canApproveStocktake(role: BusinessRole): boolean {
  return ROLES_THAT_CAN_APPROVE_STOCKTAKE.includes(role);
}

export function canBypassLocationPermissions(role: BusinessRole): boolean {
  return ROLES_THAT_BYPASS_LOCATION.includes(role);
}

export function canSell(role: BusinessRole): boolean {
  return ROLES_THAT_CAN_SELL.includes(role);
}

export function isAssignableBusinessRole(role: BusinessRole): boolean {
  return role !== BusinessRole.OWNER;
}
