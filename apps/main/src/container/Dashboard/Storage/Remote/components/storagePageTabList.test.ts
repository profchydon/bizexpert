import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("StoragePageTabList", () => {
  it("disables the Impact tab with a Coming soon tooltip", () => {
    const tabList = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/components/StoragePageTabList.tsx",
      ),
      "utf8",
    );
    const storagePage = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/StoragePage.tsx",
      ),
      "utf8",
    );

    assert.match(tabList, /DisabledWithTooltip/);
    assert.match(tabList, /reason="Coming soon"/);
    assert.match(tabList, /tab\.comingSoon/);
    assert.match(tabList, /isDisabled=\{tab\.comingSoon\}/);
    assert.match(storagePage, /comingSoon: true/);
    assert.match(storagePage, /StoragePageTabList/);
    assert.doesNotMatch(storagePage, /tab === "impact"/);
  });
});
