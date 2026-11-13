import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { EntityAdminInvitation } from "@/api/baseQueries/companiesApi/entitiesApi/entityAdminInvitationTypes";
import {
  buildEmployeeEntityAdminInvitePath,
  buildEntityAdminInvitePath,
  entityAdminInviteHasExistingAccount,
  requiresEmployeeInviteSetup,
  resolveEmployeeEntityAdminInvitePath,
} from "./entityAdminInviteRouting";

const baseInvitation: EntityAdminInvitation = {
  id: "invite-1",
  email: "admin@rayda.co",
  user_id: "user-1",
  company_id: "company-1",
  account_company_id: "account-1",
  office_id: null,
  scope_role: "entity_admin",
  code: "entity-code",
  status: "pending",
  expires_at: "2026-08-18T15:29:45.000000Z",
  entity: { id: "entity-1", name: "Intensa Nigeria 10" },
  account_company: { id: "account-1", name: "Intensa" },
  created_at: "2026-08-11T00:00:00.000000Z",
};

describe("entityAdminInviteRouting", () => {
  it("keeps existing-account invites on the entity-admin route", () => {
    assert.equal(entityAdminInviteHasExistingAccount(baseInvitation), true);
    assert.equal(requiresEmployeeInviteSetup(baseInvitation), false);
    assert.equal(resolveEmployeeEntityAdminInvitePath(baseInvitation), null);
  });

  it("redirects new users to employee invite with entity-admin params", () => {
    const invitation: EntityAdminInvitation = {
      ...baseInvitation,
      user_id: null,
      has_account: false,
      user_invitation_code: "employee-code",
    };

    assert.equal(requiresEmployeeInviteSetup(invitation), true);
    assert.equal(
      resolveEmployeeEntityAdminInvitePath(invitation),
      buildEmployeeEntityAdminInvitePath("employee-code", "entity-code"),
    );
    assert.match(
      buildEmployeeEntityAdminInvitePath("employee-code", "entity-code"),
      /\/auth\/employee-invite\?code=employee-code&flow=entity_admin&entity_invitation_code=entity-code/,
    );
  });

  it("supports employee_invitation_code as a fallback field", () => {
    const invitation: EntityAdminInvitation = {
      ...baseInvitation,
      user_id: null,
      employee_invitation_code: "employee-code",
    };

    assert.equal(
      resolveEmployeeEntityAdminInvitePath(invitation),
      buildEmployeeEntityAdminInvitePath("employee-code", "entity-code"),
    );
  });

  it("builds the entity-admin invite path for post-signup handoff", () => {
    assert.equal(
      buildEntityAdminInvitePath("entity-code"),
      "/auth/entity-admin-invite?code=entity-code",
    );
  });
});
