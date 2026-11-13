import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveSettingsType,
  settingsPath,
  SETTINGS_GROUPS,
} from "./settingsNav";

test("resolveSettingsType returns the matching tab", () => {
  assert.equal(resolveSettingsType("whatsapp"), "whatsapp");
  assert.equal(resolveSettingsType("profile"), "profile");
  assert.equal(resolveSettingsType("roles"), "roles");
  assert.equal(resolveSettingsType("unknown"), "profile");
  assert.equal(resolveSettingsType(null), "profile");
  assert.equal(resolveSettingsType(undefined), "profile");
  assert.equal(
    resolveSettingsType("profile", "/dashboard/settings/users/manage-roles"),
    "roles",
  );
});

test("settings nav includes roles and routes them to manage-roles", () => {
  assert.deepEqual(
    SETTINGS_GROUPS.flatMap((group) => group.tabs.map((tab) => tab.id)),
    ["profile", "roles", "whatsapp"],
  );
  assert.equal(settingsPath("roles"), "/dashboard/settings/users/manage-roles");
  assert.equal(settingsPath("whatsapp"), "/dashboard/settings?tab=whatsapp");
  assert.equal(settingsPath("profile"), "/dashboard/settings");
});
