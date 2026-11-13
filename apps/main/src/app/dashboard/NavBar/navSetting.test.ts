import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("NavSetting employee menu", () => {
  it("derives Go to admin from dashboard access instead of user role", () => {
    const source = readFileSync(
      "src/app/dashboard/NavBar/NavSetting.tsx",
      "utf8",
    );

    assert.match(source, /buildEmployeeAccountMenuItems/);
    assert.match(source, /access\.canAccessDashboard/);
    assert.match(source, /resolveDefaultDashboardRoute\(access\)/);
    assert.doesNotMatch(source, /Super Administrator/);
  });
});
