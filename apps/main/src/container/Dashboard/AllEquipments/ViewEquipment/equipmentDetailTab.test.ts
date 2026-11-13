import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_EQUIPMENT_DETAIL_TAB,
  isHiddenEquipmentDetailTab,
  resolveEquipmentDetailTab,
} from "./equipmentDetailTab";

describe("equipment detail tab", () => {
  it("hides telemetry and sends direct urls to overview", () => {
    const visible = ["overview", "documents", "notes"] as const;

    assert.equal(isHiddenEquipmentDetailTab("telemetry"), true);
    assert.equal(resolveEquipmentDetailTab("telemetry", visible), "overview");
    assert.equal(
      resolveEquipmentDetailTab(null, visible),
      DEFAULT_EQUIPMENT_DETAIL_TAB,
    );
    assert.equal(resolveEquipmentDetailTab("documents", visible), "documents");
    assert.equal(resolveEquipmentDetailTab("unknown", visible), "overview");
  });
});
