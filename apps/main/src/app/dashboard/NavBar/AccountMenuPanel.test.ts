import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  adminAccountMenuItems,
  adminEmployeeAccountMenuItems,
  buildEmployeeAccountMenuItems,
  accountMenuTriggerBaseClass,
  accountMenuTriggerClass,
  employeeAccountMenuItems,
  filterAccountMenuItems,
} from "./accountMenuConfig";
import routes from "@/routes";
import { resolveAccessContext } from "@/utils/auth/resolveAccessContext";
import type { IUser } from "@/types/auth";
import type { EntityMembership } from "@/types/entityMembership";

describe("account menu items", () => {
  it("includes account management for admin dashboard menus", () => {
    const item = adminAccountMenuItems.find(
      (entry) => entry.name === "Account management",
    );
    assert.ok(item);
    assert.equal(item.link, routes.ACCOUNTS);
  });

  it("orders admin items to match the account menu design", () => {
    assert.deepEqual(
      adminAccountMenuItems.map((entry) => entry.name),
      [
        "View profile",
        "Transactions",
        "Invoices",
        "Settings",
        "Account management",
      ],
    );
  });

  it("hides account management when the feature flag is disabled", () => {
    const filtered = filterAccountMenuItems(adminAccountMenuItems, false);
    assert.deepEqual(
      filtered.map((entry) => entry.name),
      ["View profile", "Transactions", "Invoices", "Settings"],
    );
  });

  it("hides account management when the permission is off", () => {
    const filtered = filterAccountMenuItems(adminAccountMenuItems, true, {
      canViewTransactions: true,
      canViewSettings: true,
      canViewAccountManagementMenu: false,
    });
    assert.deepEqual(
      filtered.map((entry) => entry.name),
      ["View profile", "Transactions", "Invoices", "Settings"],
    );
  });

  it("hides transactions and invoices when the permission is off", () => {
    const filtered = filterAccountMenuItems(adminAccountMenuItems, true, {
      canViewTransactions: false,
      canViewSettings: true,
      canViewAccountManagementMenu: true,
    });
    assert.deepEqual(
      filtered.map((entry) => entry.name),
      ["View profile", "Settings", "Account management"],
    );
  });

  it("keeps account management when the feature flag is enabled", () => {
    assert.equal(
      filterAccountMenuItems(adminAccountMenuItems, true).length,
      adminAccountMenuItems.length,
    );
  });

  it("uses a compact rounded trigger to match the account menu design", () => {
    assert.match(accountMenuTriggerClass, /rounded-lg/);
    assert.match(accountMenuTriggerClass, /h-10/);
    assert.doesNotMatch(accountMenuTriggerClass, /rounded-b/);
  });

  it("does not show a primary focus ring on the account trigger", () => {
    assert.doesNotMatch(accountMenuTriggerBaseClass, /ring-primary/);
    assert.match(accountMenuTriggerBaseClass, /focus-visible:ring-0/);
  });

  it("keeps employee menu variants separate from admin items", () => {
    assert.equal(employeeAccountMenuItems.length, 1);
    assert.equal(adminEmployeeAccountMenuItems.length, 2);
    assert.equal(
      adminEmployeeAccountMenuItems.some(
        (entry) => entry.name === "Account management",
      ),
      false,
    );
  });

  it("shows Go to admin for users with dashboard access", () => {
    const entityAdminAccess = resolveAccessContext({ role: "Basic" } as IUser, [
      {
        id: "entity-11",
        name: "Intensa UK 11",
        is_primary: false,
        country: "United Kingdom",
        parent_company_id: "company-primary",
        role: "Administrator",
        scope: "entity",
        office_ids: [],
        via_global_admin: false,
      } satisfies EntityMembership,
    ]);

    const menu = buildEmployeeAccountMenuItems(
      entityAdminAccess.canAccessDashboard,
      "/dashboard/overview?entity=entity-11",
    );

    assert.deepEqual(
      menu.map((entry) => entry.name),
      ["Go to admin", "Profile"],
    );
    assert.equal(menu[0]?.link, "/dashboard/overview?entity=entity-11");
  });

  it("hides Go to admin for member-only users", () => {
    const memberAccess = resolveAccessContext({ role: "Basic" } as IUser, [
      {
        id: "entity-11",
        name: "Intensa UK 11",
        is_primary: false,
        country: "United Kingdom",
        parent_company_id: "company-primary",
        role: "Member",
        scope: "member",
        office_ids: [],
        via_global_admin: false,
      } satisfies EntityMembership,
    ]);

    const menu = buildEmployeeAccountMenuItems(memberAccess.canAccessDashboard);

    assert.deepEqual(
      menu.map((entry) => entry.name),
      ["Profile"],
    );
  });
});
