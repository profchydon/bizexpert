"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { bizexpertApi } from "@/lib/bizexpert/api";
import routes from "@/routes";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { BusinessMember } from "@/types/bizexpert";
import { locationsQueryKeys } from "../Locations/locationsQueryKeys";
import { DEFAULT_BUSINESS_ROLES } from "./lumiBusinessRoles";
import { membersForRole } from "./defaultBusinessRoles";
import { RolePermissionColumn } from "./RolePermissionColumn";
import {
  resolveManageRoleId,
  splitRolePermissions,
} from "./rolePermissions/splitRolePermissions";
import { settingsTwoColumnClass } from "./settingsPageClasses";
import { SettingsShell } from "./SettingsShell";

export function RolePermissions() {
  const params = useParams();
  const { businessId } = useBizExpertBusiness();
  const roleId = resolveManageRoleId(String(params.roleId ?? ""));
  const role = DEFAULT_BUSINESS_ROLES.find((row) => row.id === roleId);

  const { data: members = [] } = useQuery({
    queryKey: locationsQueryKeys.members(businessId ?? ""),
    enabled: Boolean(businessId && role),
    queryFn: async () =>
      (await bizexpertApi.get(`/businesses/${businessId}/members`))
        .data as BusinessMember[],
  });

  const split = useMemo(
    () => (role ? splitRolePermissions(role.id) : null),
    [role],
  );

  if (!role || !split) {
    return (
      <SettingsShell type="roles" breadCrumbs={["Settings", "Roles"]}>
        <p className="text-sm text-gray-600">
          Role not found.{" "}
          <Link
            href={routes.SETTINGS_ROLES}
            className="text-brand-600 underline"
          >
            Back to roles
          </Link>
        </p>
      </SettingsShell>
    );
  }

  const assigned = membersForRole(members, role.id);

  return (
    <SettingsShell type="roles" breadCrumbs={["Settings", "Roles", role.name]}>
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">{role.name}</h2>
            <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
              Default
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{role.summary}</p>
          <p className="mt-1 text-sm text-gray-600">
            {assigned.length} member{assigned.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className={settingsTwoColumnClass}>
          <RolePermissionColumn
            title="Authorized Permissions"
            groups={split.authorized}
            tone="authorized"
          />
          <RolePermissionColumn
            title="Unauthorized Permissions"
            groups={split.unauthorized}
            tone="unauthorized"
          />
        </div>
      </div>
    </SettingsShell>
  );
}
