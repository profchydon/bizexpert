import type { BusinessMember } from "@/types/bizexpert";
import {
  DEFAULT_BUSINESS_ROLES,
  type DefaultBusinessRole,
  type DefaultBusinessRoleId,
} from "./lumiBusinessRoles";

export {
  DEFAULT_BUSINESS_ROLES,
  type DefaultBusinessRole,
  type DefaultBusinessRoleId,
};

export type ManageRoleRow = DefaultBusinessRole & { memberCount: number };

export function buildManageRoleRows(
  members: BusinessMember[],
): ManageRoleRow[] {
  return DEFAULT_BUSINESS_ROLES.map((role) => ({
    ...role,
    memberCount: members.filter((member) => member.role === role.id).length,
  }));
}

export function filterManageRoles(
  rows: ManageRoleRow[],
  query: string,
): ManageRoleRow[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter((row) =>
    `${row.name} ${row.id}`.toLowerCase().includes(needle),
  );
}

export function membersForRole(
  members: BusinessMember[],
  roleId: DefaultBusinessRoleId,
): BusinessMember[] {
  return members.filter((member) => member.role === roleId);
}

export function memberDisplayName(member: BusinessMember): string {
  const name = member.user?.name?.trim();
  if (name) return name;
  return member.user?.email ?? "Member";
}
