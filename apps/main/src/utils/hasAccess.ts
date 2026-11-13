export type IUserRole = "Super Administrator" | "Administrator" | "Basic";

export function hasAccess(
  userRole: IUserRole,
  allowedRoles: IUserRole[],
): boolean {
  return allowedRoles.includes(userRole);
}
