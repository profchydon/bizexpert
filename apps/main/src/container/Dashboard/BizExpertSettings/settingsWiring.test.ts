import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("settings page is wired to the BizExpert settings container", () => {
  const page = readFileSync("src/app/dashboard/settings/page.tsx", "utf8");
  assert.equal(page.includes("DashboardSectionPlaceholder"), false);
  assert.equal(page.includes("@/container/Dashboard/BizExpertSettings"), true);
  assert.equal(page.includes("@/container/Dashboard/Settings"), true);
});

test("profile settings persist the public user after PUT", () => {
  const profile = readFileSync(
    "src/container/Dashboard/BizExpertSettings/ProfileSettings.tsx",
    "utf8",
  );
  const auth = readFileSync("src/store/bizexpert/auth-context.tsx", "utf8");
  assert.equal(profile.includes("bizexpertApi.put"), true);
  assert.equal(profile.includes('"/auth/profile"'), true);
  assert.equal(profile.includes("updateUser"), true);
  assert.equal(auth.includes("updateUser"), true);
});

test("manage roles lists default API roles from members", () => {
  const page = readFileSync(
    "src/app/dashboard/settings/users/manage-roles/page.tsx",
    "utf8",
  );
  const table = readFileSync(
    "src/container/Dashboard/BizExpertSettings/ManageRolesTable.tsx",
    "utf8",
  );
  const catalog = readFileSync(
    "src/container/Dashboard/BizExpertSettings/lumiBusinessRoles.ts",
    "utf8",
  );
  assert.equal(page.includes("BizExpertSettings"), true);
  assert.equal(table.includes("/members"), true);
  assert.equal(catalog.includes('"owner"'), true);
  assert.equal(catalog.includes('"admin"'), true);
  assert.equal(catalog.includes("Store keeper"), true);
  assert.equal(catalog.includes("Waybill manager"), true);
  assert.equal(catalog.includes("Accountant"), true);
  assert.equal(table.includes("SETTINGS_ROLE"), true);
});

test("role permission page splits authorized and unauthorized access", () => {
  const page = readFileSync(
    "src/app/dashboard/settings/users/manage-roles/[roleId]/page.tsx",
    "utf8",
  );
  const view = readFileSync(
    "src/container/Dashboard/BizExpertSettings/RolePermissions.tsx",
    "utf8",
  );
  assert.equal(page.includes("RolePermissions"), true);
  assert.equal(view.includes("Authorized Permissions"), true);
  assert.equal(view.includes("Unauthorized Permissions"), true);
  assert.equal(view.includes("splitRolePermissions"), true);
});

test("whatsapp settings use the identities API", () => {
  const whatsapp = readFileSync(
    "src/container/Dashboard/BizExpertSettings/WhatsappSettings.tsx",
    "utf8",
  );
  assert.equal(whatsapp.includes("whatsapp-identities"), true);
  assert.equal(whatsapp.includes("bizexpertApi.post"), true);
  assert.equal(whatsapp.includes("bizexpertApi.delete"), true);
  assert.equal(whatsapp.includes("whatsappPhone"), true);
});
