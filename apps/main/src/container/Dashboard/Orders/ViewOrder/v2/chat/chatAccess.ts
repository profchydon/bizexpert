import type { IUser } from "@/types/auth";
import { hasAccess, IUserRole } from "@/utils/hasAccess";

export const ORDER_CHAT_ROLES: IUserRole[] = [
  "Super Administrator",
  "Administrator",
];

export function canAccessOrderChat(
  user?: Pick<IUser, "role" | "status"> | null,
): boolean {
  if (!user) return false;
  const isActive = user.status?.toLowerCase() === "active";
  return isActive && hasAccess(user.role as IUserRole, ORDER_CHAT_ROLES);
}
