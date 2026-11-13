import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEFAULT_SETTINGS_TYPE,
  SETTINGS_GROUPS,
  SETTINGS_TABS,
  resolveSettingsType,
} from "./settingsNav";

describe("settings navigation", () => {
  it("lists every tab in exactly one sidebar group", () => {
    const grouped = SETTINGS_GROUPS.flatMap((group) => group.tabs);
    assert.deepEqual(
      grouped.slice().sort(),
      SETTINGS_TABS.map((tab) => tab.id).sort(),
    );
    assert.equal(new Set(grouped).size, grouped.length);
  });

  it("falls back when the query param is missing or unknown", () => {
    assert.equal(resolveSettingsType(null), DEFAULT_SETTINGS_TYPE);
    assert.equal(resolveSettingsType("password"), DEFAULT_SETTINGS_TYPE);
  });

  it("hides the IT Approvals tab and sends old urls to company info", () => {
    assert.equal(
      SETTINGS_TABS.map((tab) => tab.label).includes("IT Approvals"),
      false,
    );
    assert.equal(resolveSettingsType("resolve-scripts"), "company-info");
  });

  it("hides Agent configuration and sends direct urls to company info", () => {
    assert.equal(
      SETTINGS_TABS.map((tab) => tab.label).includes("Agent configuration"),
      false,
    );
    assert.equal(resolveSettingsType("agent-config"), "company-info");
  });

  it("keeps legacy credentials and refresh urls on the current tabs", () => {
    assert.equal(resolveSettingsType("apiKeys"), "credentials");
    assert.equal(resolveSettingsType("equipmentRefresh"), "equipment-refresh");
    assert.equal(resolveSettingsType("subscription"), "subscription");
  });
});
