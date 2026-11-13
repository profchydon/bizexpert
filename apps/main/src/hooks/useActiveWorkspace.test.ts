import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("active workspace hook wiring", () => {
  it("centralizes workspace resolution in useActiveWorkspace", () => {
    const hook = readFileSync("src/hooks/useActiveWorkspace.ts", "utf8");
    const switcher = readFileSync(
      "src/app/dashboard/NavBar/useAccountSwitcher.ts",
      "utf8",
    );
    const employeesTable = readFileSync(
      "src/container/Dashboard/Employees/EmployeesTable/index.tsx",
      "utf8",
    );

    assert.match(hook, /resolveActiveWorkspaceId/);
    assert.match(hook, /activeEntityId/);
    assert.match(switcher, /useActiveWorkspace/);
    assert.match(switcher, /buildSwitcherScopes/);
    assert.match(switcher, /navigateToWorkspaceScope/);
    assert.match(switcher, /switchingScopeId/);
    assert.match(switcher, /useGetEntityQuery/);
    assert.doesNotMatch(switcher, /useTransitionRouter/);
    assert.match(employeesTable, /useActiveWorkspace/);
    assert.match(employeesTable, /activeEntityId: entityId/);
  });

  it("builds switcher scopes from access context instead of user role", () => {
    const scopes = readFileSync(
      "src/app/dashboard/NavBar/accountSwitcherScopes.ts",
      "utf8",
    );

    assert.match(scopes, /access: AccessContext/);
    assert.match(scopes, /filterEntitiesForWorkspaceSwitcher/);
    assert.match(scopes, /UNRESOLVED_WORKSPACE_LABEL/);
    assert.doesNotMatch(scopes, /Selected workspace/);
    assert.doesNotMatch(scopes, /isGlobalAdmin:/);
  });
});
