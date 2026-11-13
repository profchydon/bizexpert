import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("OpenFleetAccessWrapper", () => {
  it("gates the storage import route with a Manage upgrade prompt", () => {
    const wrapper = readFileSync(
      "src/container/Dashboard/Storage/Remote/OpenFleetAccessWrapper.tsx",
      "utf8",
    );
    const importRoute = readFileSync(
      "src/app/dashboard/storage/import/page.tsx",
      "utf8",
    );

    assert.match(wrapper, /canUseOpenFleet/);
    assert.match(wrapper, /PlanUpgradePrompt/);
    assert.match(wrapper, /Open Fleet is on Manage and above/);
    assert.match(wrapper, /routes\.STORAGE/);
    assert.doesNotMatch(wrapper, /catalog_limit/);
    assert.match(importRoute, /OpenFleetAccessWrapper/);
    assert.match(importRoute, /StorageRemoteGate/);
  });
});
