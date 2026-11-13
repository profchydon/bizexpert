import assert from "node:assert/strict";
import { test } from "node:test";
import { ROLE_PERMISSIONS } from "./rolePermissions/permissionCatalog";
import {
  resolveManageRoleId,
  splitRolePermissions,
} from "./rolePermissions/splitRolePermissions";

test("resolves Lumi role numbers and slugs", () => {
  assert.equal(resolveManageRoleId("1"), "owner");
  assert.equal(resolveManageRoleId("owner"), "owner");
  assert.equal(resolveManageRoleId("11"), "accountant");
  assert.equal(resolveManageRoleId("cashier"), "cashier");
  assert.equal(resolveManageRoleId("99"), null);
  assert.equal(resolveManageRoleId("attendant"), null);
});

test("permission ids are unique and include Lumi labels", () => {
  const ids = ROLE_PERMISSIONS.map((row) => row.id);
  assert.equal(new Set(ids).size, ids.length);
  const labels = ROLE_PERMISSIONS.map((row) => row.label);
  assert.equal(labels.includes("Can approve stock removal"), true);
  assert.equal(
    labels.includes(
      "Can view Payment dashboard( Overview, cash and customer analytics)",
    ),
    true,
  );
  assert.equal(labels.includes("Can create, update and invite users"), true);
  assert.equal(labels.includes("Can view customer"), true);
  assert.equal(labels.includes("can_void_journal_entry"), true);
});

test("owner and admin are authorized for every permission", () => {
  for (const role of ["owner", "admin"] as const) {
    const { authorized, unauthorized } = splitRolePermissions(role);
    const allowed = authorized.flatMap((group) => group.items);
    const denied = unauthorized.flatMap((group) => group.items);
    assert.equal(allowed.length, ROLE_PERMISSIONS.length);
    assert.equal(denied.length, 0);
    assert.equal(
      allowed.some((row) => row.id === "can_create_custom_roles"),
      true,
    );
    assert.equal(
      allowed.some((row) => row.id === "can_generate_waybill"),
      true,
    );
  }
});

test("cashier can sell but cannot manage users", () => {
  const { authorized, unauthorized } = splitRolePermissions("cashier");
  const allowed = authorized
    .flatMap((group) => group.items)
    .map((row) => row.id);
  const denied = unauthorized
    .flatMap((group) => group.items)
    .map((row) => row.id);
  assert.equal(allowed.includes("can_checkout_with_cash_payment"), true);
  assert.equal(allowed.includes("can_view_products"), true);
  assert.equal(denied.includes("can_delete_users"), true);
  assert.equal(denied.includes("can_add_products"), true);
});
