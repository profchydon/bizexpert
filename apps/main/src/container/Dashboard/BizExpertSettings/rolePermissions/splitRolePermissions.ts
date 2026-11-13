import { DEFAULT_BUSINESS_ROLES } from "../lumiBusinessRoles";
import { groupPermissions, ROLE_PERMISSIONS } from "./permissionCatalog";
import type { RolePermission } from "./permissionTypes";
import { roleHasAllPermissions, roleHasCapability } from "./roleCapabilities";
import type { BusinessRole } from "@/types/bizexpert";

export function resolveManageRoleId(
  param: string | undefined,
): BusinessRole | null {
  if (!param) return null;
  const slug = DEFAULT_BUSINESS_ROLES.find((role) => role.id === param);
  if (slug) return slug.id;
  const index = Number(param);
  if (
    Number.isInteger(index) &&
    index >= 1 &&
    index <= DEFAULT_BUSINESS_ROLES.length
  ) {
    return DEFAULT_BUSINESS_ROLES[index - 1]!.id;
  }
  return null;
}

export function splitRolePermissions(role: BusinessRole) {
  const authorized: RolePermission[] = [];
  const unauthorized: RolePermission[] = [];
  for (const permission of ROLE_PERMISSIONS) {
    if (
      roleHasAllPermissions(role) ||
      (permission.capability && roleHasCapability(role, permission.capability))
    ) {
      authorized.push(permission);
    } else {
      unauthorized.push(permission);
    }
  }
  return {
    authorized: groupPermissions(authorized),
    unauthorized: groupPermissions(unauthorized),
  };
}
