import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  assetDetailUpgradeHref,
  equipmentViewHref,
} from "./assetDetailUpgrade";

describe("asset detail upgrade", () => {
  it("keeps a locked asset on the fleet and opens the upgrade dialog", () => {
    const detail = "/dashboard/all-equipments/device-1";
    assert.equal(equipmentViewHref(detail, true), detail);
    assert.equal(equipmentViewHref(detail, false), assetDetailUpgradeHref());
    assert.match(assetDetailUpgradeHref(), /assetUpgrade=1/);
  });

  it("sends a direct asset link back to that dialog", () => {
    const gate = readFileSync(
      "src/container/Dashboard/AllEquipments/AssetDetailGate.tsx",
      "utf8",
    );
    assert.match(gate, /replace\(assetDetailUpgradeHref\(\)\)/);
    assert.doesNotMatch(gate, /PlanUpgradePrompt/);
  });
});
