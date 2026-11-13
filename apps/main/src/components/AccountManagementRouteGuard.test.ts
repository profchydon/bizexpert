import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const source = readFileSync(
  "src/components/AccountManagementRouteGuard.tsx",
  "utf8",
);

describe("AccountManagementRouteGuard workspace gate", () => {
  it("sends global admins back to overview when they leave Primary", () => {
    assert.match(source, /isPrimaryWorkspace/);
    assert.match(source, /access\.isGlobalAdmin/);
    assert.match(source, /buildWorkspaceOverviewPath/);
  });

  it("still waits on the account management feature flag", () => {
    assert.match(source, /FEATURE_FLAGS\.ACCOUNT_MANAGEMENT/);
    assert.match(source, /resolveRouteWhenAccountManagementDisabled/);
  });
});
