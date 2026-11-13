import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("Account menu workspace switcher", () => {
  it("matches the design-ui account menu structure", () => {
    const itemsSource = readFileSync(
      join(process.cwd(), "src/app/dashboard/NavBar/AccountMenuItems.tsx"),
      "utf8",
    );
    const panelSource = readFileSync(
      join(process.cwd(), "src/app/dashboard/NavBar/AccountMenuPanel.tsx"),
      "utf8",
    );
    const navSettingSource = readFileSync(
      join(process.cwd(), "src/app/dashboard/NavBar/NavSetting.tsx"),
      "utf8",
    );

    const sectionSource = readFileSync(
      join(
        process.cwd(),
        "src/app/dashboard/NavBar/WorkspaceSwitcherSection.tsx",
      ),
      "utf8",
    );

    assert.match(sectionSource, /Switch workspace/);
    assert.match(sectionSource, /max-h-72 overflow-y-auto/);
    assert.match(sectionSource, /See more/);
    assert.match(sectionSource, /Primary/);
    assert.match(itemsSource, /Invoices: Receipt/);
    assert.match(itemsSource, /WorkspaceSwitcherSection/);
    assert.match(itemsSource, /Sign out/);
    assert.match(panelSource, /useAccountSwitcher/);
    assert.match(panelSource, /workspaceSwitcher=\{workspaceSwitcher\}/);
    assert.match(panelSource, /flagByCode/);
    assert.match(navSettingSource, /showWorkspaceSwitcher=\{!isEmployee\}/);
  });
});
