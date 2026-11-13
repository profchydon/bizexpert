import type { IUser } from "@/types/auth";
import type { EntityMembership } from "@/types/entityMembership";
import routes from "@/routes";

export type ActingAccessRole = "global" | "entity" | "office" | "member";

export interface AccessContext {
  userRole: string | null;
  memberships: EntityMembership[];
  isGlobalAdmin: boolean;
  entityAdminEntityIds: string[];
  officeAdminOfficeIds: string[];
  memberEntityIds: string[];
  canAccessDashboard: boolean;
  canAccessEmployeePortal: boolean;
  isMemberOnly: boolean;
  defaultDashboardEntityId: string | null;
  actingRole: ActingAccessRole;
}

const GLOBAL_ADMIN_ROLES = new Set(["Super Administrator", "Administrator"]);

export function isGlobalAdminUserRole(role?: string | null): boolean {
  if (!role) return false;
  return GLOBAL_ADMIN_ROLES.has(role);
}

export function isEntityAdministratorMembership(
  membership: EntityMembership,
): boolean {
  return membership.scope === "entity" && membership.role === "Administrator";
}

export function isOfficeAdministratorMembership(
  membership: EntityMembership,
): boolean {
  return membership.scope === "office" && membership.role === "Administrator";
}

export function isMemberMembership(membership: EntityMembership): boolean {
  return membership.scope === "member";
}

export function resolveAccessContext(
  user?: IUser | null,
  memberships: EntityMembership[] = [],
): AccessContext {
  const userRole = user?.role ?? null;
  const scopedMemberships = memberships ?? [];

  const entityAdminEntityIds = scopedMemberships
    .filter(isEntityAdministratorMembership)
    .map((membership) => membership.id);

  const officeAdminOfficeIds = scopedMemberships
    .filter(isOfficeAdministratorMembership)
    .flatMap((membership) => membership.office_ids ?? []);

  const viaGlobalAdmin = scopedMemberships.some(
    (membership) =>
      membership.via_global_admin || membership.scope === "global",
  );
  const isScopedAdministrator =
    entityAdminEntityIds.length > 0 || officeAdminOfficeIds.length > 0;
  const isGlobalAdmin =
    viaGlobalAdmin ||
    (isGlobalAdminUserRole(userRole) && !isScopedAdministrator);

  const memberEntityIds = scopedMemberships
    .filter(isMemberMembership)
    .map((membership) => membership.id);

  const canAccessDashboard =
    isGlobalAdmin ||
    entityAdminEntityIds.length > 0 ||
    officeAdminOfficeIds.length > 0;

  const canAccessEmployeePortal =
    memberEntityIds.length > 0 || isGlobalAdmin || canAccessDashboard;

  const isMemberOnly = !canAccessDashboard && canAccessEmployeePortal;

  const defaultDashboardEntityId = isGlobalAdmin
    ? null
    : (entityAdminEntityIds[0] ?? null);

  const actingRole: ActingAccessRole = (() => {
    if (isGlobalAdmin) return "global";
    if (entityAdminEntityIds.length > 0) return "entity";
    if (officeAdminOfficeIds.length > 0) return "office";
    return "member";
  })();

  return {
    userRole,
    memberships: scopedMemberships,
    isGlobalAdmin,
    entityAdminEntityIds,
    officeAdminOfficeIds,
    memberEntityIds,
    canAccessDashboard,
    canAccessEmployeePortal,
    isMemberOnly,
    defaultDashboardEntityId,
    actingRole,
  };
}

export function resolveDefaultDashboardRoute(access: AccessContext): string {
  if (!access.canAccessDashboard) {
    return routes.EMPLOYEE;
  }

  if (access.defaultDashboardEntityId) {
    return `${routes.OVERVIEW}?entity=${encodeURIComponent(access.defaultDashboardEntityId)}`;
  }

  return routes.OVERVIEW;
}

export function shouldRedirectBasicUserToEmployeePortal(
  access: AccessContext,
): boolean {
  return access.isMemberOnly;
}
