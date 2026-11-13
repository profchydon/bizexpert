import type { AccessContext } from "@/utils/auth/resolveAccessContext";
import type { ActingAdmin } from "@/container/Dashboard/Accounts/types";
import type { IUser } from "@/types/auth";
import { getAdministeredEntityIds } from "@/utils/workspace/activeWorkspace";

export function mapActingRoleToAdminRole(
  access: AccessContext,
): ActingAdmin["role"] {
  if (access.isGlobalAdmin) return "global";
  if (access.actingRole === "office") return "office";
  return "subsidiary";
}

export function resolveActingAdmin(
  user: IUser | null | undefined,
  access: AccessContext,
  activeEntityId: string | null,
): ActingAdmin {
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ");

  return {
    role: mapActingRoleToAdminRole(access),
    name: name || "Admin",
    userId: user?.id,
    activeEntityId,
    administeredEntityIds: getAdministeredEntityIds(access),
    officeIds: access.officeAdminOfficeIds,
  };
}
