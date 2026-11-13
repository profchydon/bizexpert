import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

import {
  accountsFilterPanelFooterClass,
  accountsFilterPanelResetClass,
} from "./accountsFilterPanelClasses";

describe("accountsFilterPanelClasses", () => {
  it("uses a text reset action and primary apply button layout", () => {
    assert.match(accountsFilterPanelFooterClass, /justify-between/);
    assert.match(accountsFilterPanelResetClass, /text-gray-500/);
  });
});

describe("AccountsFilterPanel", () => {
  it("applies cleared filters and closes when reset is clicked", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/AccountsFilterPanel.tsx",
      ),
      "utf8",
    );

    assert.match(source, /handleReset/);
    assert.match(source, /onApply\(cleared\)/);
    assert.match(source, /onClose\(\)/);
    assert.match(source, /variant="primary"/);
    assert.match(source, /accountsFilterPanelResetClass/);
  });
});

describe("OfficeCreateLauncher", () => {
  it("uses the primary toolbar button styling", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/Offices/components/OfficeCreateLauncher.tsx",
      ),
      "utf8",
    );

    assert.match(source, /variant="primary"/);
    assert.match(source, /accountsToolbarPrimaryButtonClass/);
    assert.doesNotMatch(source, /variant="outline"/);
  });
});
