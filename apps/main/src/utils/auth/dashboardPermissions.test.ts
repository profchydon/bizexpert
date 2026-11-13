import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IUser } from "@/types/auth";
import type { EntityMembership } from "@/types/entityMembership";
import { resolveAccessContext } from "@/utils/auth/resolveAccessContext";
import { resolveActingAdmin } from "@/utils/auth/resolveActingAdmin";
import {
  canViewDashboardNavItem,
  resolveDashboardPermissions,
} from "@/utils/auth/resolveDashboardPermissions";
import routes from "@/routes";

const entityAdminMembership = (id: string, name: string): EntityMembership => ({
  id,
  name,
  is_primary: false,
  country: "United Kingdom",
  parent_company_id: "company-primary",
  role: "Administrator",
  scope: "entity",
  office_ids: [],
  via_global_admin: false,
});

describe("resolveDashboardPermissions", () => {
  it("grants global admins full dashboard and account access", () => {
    const access = resolveAccessContext({ role: "Administrator" } as IUser, []);
    const permissions = resolveDashboardPermissions(access, null);

    assert.equal(permissions.canViewSettings, true);
    assert.equal(permissions.canViewAccountsIndex, true);
    assert.equal(permissions.canViewAccountManagementMenu, true);
    assert.equal(permissions.canViewDepartments, true);
  });

  it("hides account management when a global admin leaves Primary", () => {
    const access = resolveAccessContext({ role: "Administrator" } as IUser, [
      {
        ...entityAdminMembership("entity-11", "Intensa UK 11"),
        via_global_admin: true,
      },
    ]);
    const permissions = resolveDashboardPermissions(access, "entity-11");

    assert.equal(access.isGlobalAdmin, true);
    assert.equal(permissions.canViewAccountManagementMenu, false);
    assert.equal(permissions.canViewAccountsIndex, false);
    assert.equal(permissions.canCreateEntities, false);
    assert.equal(permissions.canViewEmployees, true);
  });

  it("keeps account management when the active workspace is the primary entity", () => {
    const access = resolveAccessContext({ role: "Administrator" } as IUser, [
      {
        ...entityAdminMembership("company-primary", "Intensa"),
        is_primary: true,
        parent_company_id: null,
        via_global_admin: true,
      },
    ]);
    const permissions = resolveDashboardPermissions(access, "company-primary");

    assert.equal(permissions.canViewAccountManagementMenu, true);
    assert.equal(permissions.canViewAccountsIndex, true);
  });

  it("limits entity admins to operational areas and their entity detail", () => {
    const access = resolveAccessContext({ role: "Basic" } as IUser, [
      entityAdminMembership("entity-11", "Intensa UK 11"),
    ]);
    const permissions = resolveDashboardPermissions(access, "entity-11");

    assert.equal(permissions.canViewEmployees, true);
    assert.equal(permissions.canViewDepartments, false);
    assert.equal(permissions.canViewSettings, false);
    assert.equal(permissions.canViewAccountsIndex, false);
    assert.equal(
      permissions.entityDetailPath,
      routes.SUBSIDIARY_DETAIL("entity-11"),
    );
    assert.equal(canViewDashboardNavItem(permissions, "marketplace"), true);
    assert.equal(canViewDashboardNavItem(permissions, "department"), false);
  });
});

describe("resolveActingAdmin", () => {
  it("maps memberships to administered entity ids instead of display names", () => {
    const access = resolveAccessContext({ role: "Basic" } as IUser, [
      entityAdminMembership("entity-11", "Intensa UK 11"),
    ]);
    const acting = resolveActingAdmin(
      { id: "user-1", first_name: "Matthew", last_name: "Ola" } as IUser,
      access,
      "entity-11",
    );

    assert.equal(acting.role, "subsidiary");
    assert.deepEqual(acting.administeredEntityIds, ["entity-11"]);
    assert.equal(acting.activeEntityId, "entity-11");
  });
});
