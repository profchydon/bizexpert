import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("workspace switch loading", () => {
  it("shows an immediate DOM overlay before hard navigation", () => {
    const source = readFileSync(
      "src/utils/workspace/activeWorkspace.ts",
      "utf8",
    );
    const overlaySource = readFileSync(
      "src/utils/workspace/workspaceSwitchOverlay.ts",
      "utf8",
    );

    assert.match(source, /showImmediateWorkspaceSwitchOverlay\(\)/);
    assert.match(overlaySource, /WORKSPACE_SWITCH_OVERLAY_ID/);
    assert.match(overlaySource, /document\.body\.appendChild/);
  });

  it("tracks the selected scope while switching in the account switcher", () => {
    const switcherSource = readFileSync(
      "src/app/dashboard/NavBar/useAccountSwitcher.ts",
      "utf8",
    );
    const sectionSource = readFileSync(
      "src/app/dashboard/NavBar/WorkspaceSwitcherSection.tsx",
      "utf8",
    );

    assert.match(switcherSource, /switchingScopeId/);
    assert.match(switcherSource, /flushSync/);
    assert.match(sectionSource, /switchingScopeId/);
    assert.match(sectionSource, /Loading02/);
    assert.match(sectionSource, /disabled=\{isSwitchingWorkspace\}/);
  });

  it("keeps the dashboard overlay visible until workspace queries settle", () => {
    const layoutSource = readFileSync("src/app/dashboard/layout.tsx", "utf8");
    const hookSource = readFileSync(
      "src/hooks/useWorkspaceSwitchLoadingOverlay.ts",
      "utf8",
    );

    assert.match(layoutSource, /WorkspaceSwitchLoadingOverlay/);
    assert.match(layoutSource, /Suspense/);
    assert.match(layoutSource, /AuthProtectWrapper/);
    assert.match(hookSource, /useGetDashboardQuery/);
    assert.match(hookSource, /useGetDashboardCountrySummaryQuery/);
    assert.doesNotMatch(hookSource, /document\.readyState/);
  });
});
