import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IUser } from "@/types/auth";
import type { EntityMembership } from "@/types/entityMembership";
import routes from "@/routes";
import {
  resolveAccessContext,
  resolveDefaultDashboardRoute,
  shouldRedirectBasicUserToEmployeePortal,
} from "./resolveAccessContext";

const basicUser = {
  id: "user-1",
  role: "Basic",
  stage: "Completed",
} as IUser;

const globalAdminUser = {
  id: "user-2",
  role: "Administrator",
  stage: "Completed",
} as IUser;

const primaryMemberMembership: EntityMembership = {
  id: "company-primary",
  name: "Intensa",
  is_primary: true,
  country: "United Kingdom",
  parent_company_id: null,
  role: "Basic",
  scope: "member",
  office_ids: [],
  via_global_admin: false,
};

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

describe("resolveAccessContext", () => {
  it("treats member-only Basic users as employee-portal only", () => {
    const access = resolveAccessContext(basicUser, [primaryMemberMembership]);

    assert.equal(access.canAccessDashboard, false);
    assert.equal(access.canAccessEmployeePortal, true);
    assert.equal(access.isMemberOnly, true);
    assert.equal(access.actingRole, "member");
    assert.equal(shouldRedirectBasicUserToEmployeePortal(access), true);
  });

  it("allows dashboard access for Basic users with entity admin memberships", () => {
    const access = resolveAccessContext(basicUser, [
      primaryMemberMembership,
      entityAdminMembership("entity-11", "Intensa United Kingdom 11"),
      entityAdminMembership("entity-13", "Intensa United Kingdom 13"),
    ]);

    assert.equal(access.canAccessDashboard, true);
    assert.equal(access.canAccessEmployeePortal, true);
    assert.equal(access.isMemberOnly, false);
    assert.equal(access.actingRole, "entity");
    assert.deepEqual(access.entityAdminEntityIds, ["entity-11", "entity-13"]);
    assert.equal(shouldRedirectBasicUserToEmployeePortal(access), false);
  });

  it("defaults entity-only admins to their first administered entity", () => {
    const access = resolveAccessContext(basicUser, [
      primaryMemberMembership,
      entityAdminMembership("entity-11", "Intensa United Kingdom 11"),
    ]);

    assert.equal(
      resolveDefaultDashboardRoute(access),
      `${routes.OVERVIEW}?entity=entity-11`,
    );
  });

  it("does not treat invited entity administrators as global admins", () => {
    const access = resolveAccessContext({ role: "Administrator" } as IUser, [
      entityAdminMembership("entity-usa", "Bamboo USA"),
    ]);

    assert.equal(access.isGlobalAdmin, false);
    assert.equal(access.actingRole, "entity");
    assert.equal(
      resolveDefaultDashboardRoute(access),
      `${routes.OVERVIEW}?entity=entity-usa`,
    );
  });

  it("sends global admins to the account-wide overview", () => {
    const access = resolveAccessContext(globalAdminUser, [
      primaryMemberMembership,
    ]);

    assert.equal(access.isGlobalAdmin, true);
    assert.equal(access.canAccessDashboard, true);
    assert.equal(resolveDefaultDashboardRoute(access), routes.OVERVIEW);
  });

  it("grants global access through via_global_admin on a membership", () => {
    const access = resolveAccessContext(basicUser, [
      {
        ...primaryMemberMembership,
        via_global_admin: true,
      },
    ]);

    assert.equal(access.isGlobalAdmin, true);
    assert.equal(access.canAccessDashboard, true);
    assert.equal(resolveDefaultDashboardRoute(access), routes.OVERVIEW);
  });

  it("allows office admins into the dashboard without entity admin scope", () => {
    const access = resolveAccessContext(basicUser, [
      {
        id: "office-entity",
        name: "Office Entity",
        is_primary: false,
        country: "United Kingdom",
        parent_company_id: "company-primary",
        role: "Administrator",
        scope: "office",
        office_ids: ["office-1"],
        via_global_admin: false,
      },
    ]);

    assert.equal(access.canAccessDashboard, true);
    assert.equal(access.actingRole, "office");
    assert.deepEqual(access.officeAdminOfficeIds, ["office-1"]);
    assert.equal(resolveDefaultDashboardRoute(access), routes.OVERVIEW);
  });
});
