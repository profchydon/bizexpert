import type { EntityAdminInvitation } from "@/api/baseQueries/companiesApi/entitiesApi/entityAdminInvitationTypes";
import routes from "@/routes";

export const ENTITY_ADMIN_EMPLOYEE_INVITE_FLOW = "entity_admin";

export function readEmployeeInvitationCode(
  invitation: EntityAdminInvitation,
): string {
  return (
    invitation.user_invitation_code?.trim() ||
    invitation.employee_invitation_code?.trim() ||
    ""
  );
}

export function entityAdminInviteHasExistingAccount(
  invitation: EntityAdminInvitation,
): boolean {
  if (invitation.has_account === true) return true;
  if (invitation.has_account === false) return false;
  return Boolean(invitation.user_id?.trim());
}

export function requiresEmployeeInviteSetup(
  invitation: EntityAdminInvitation,
): boolean {
  if (entityAdminInviteHasExistingAccount(invitation)) return false;
  return readEmployeeInvitationCode(invitation).length > 0;
}

export function buildEmployeeEntityAdminInvitePath(
  employeeInvitationCode: string,
  entityInvitationCode: string,
): string {
  const params = new URLSearchParams({
    code: employeeInvitationCode,
    flow: ENTITY_ADMIN_EMPLOYEE_INVITE_FLOW,
    entity_invitation_code: entityInvitationCode,
  });
  return `${routes.EMPLOYEE_INVITE}?${params.toString()}`;
}

export function resolveEmployeeEntityAdminInvitePath(
  invitation: EntityAdminInvitation,
): string | null {
  if (!requiresEmployeeInviteSetup(invitation)) return null;
  const employeeCode = readEmployeeInvitationCode(invitation);
  if (!employeeCode) return null;
  return buildEmployeeEntityAdminInvitePath(employeeCode, invitation.code);
}

export function buildEntityAdminInvitePath(code: string): string {
  const params = new URLSearchParams({ code });
  return `${routes.ENTITY_ADMIN_INVITE}?${params.toString()}`;
}

export function isEntityAdminEmployeeInviteFlow(flow: string | null): boolean {
  return flow === ENTITY_ADMIN_EMPLOYEE_INVITE_FLOW;
}
