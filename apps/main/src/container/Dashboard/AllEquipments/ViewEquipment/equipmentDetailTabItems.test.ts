import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { buildEquipmentDetailTabs } from "./equipmentDetailTabItems";

describe("buildEquipmentDetailTabs", () => {
  it("returns overview, documents, and notes tabs for ineligible types", () => {
    const tabs = buildEquipmentDetailTabs({ type: "Accessories" } as any);

    assert.deepEqual(
      tabs.map((tab) => tab.id),
      ["overview", "documents", "notes"],
    );
  });

  it("does not add a telemetry tab for eligible laptop types", () => {
    const tabs = buildEquipmentDetailTabs({ type: "Laptop" } as any);

    assert.deepEqual(
      tabs.map((tab) => tab.id),
      ["overview", "documents", "notes"],
    );
  });

  it("omits badges when there is nothing to count", () => {
    const tabs = buildEquipmentDetailTabs({
      documents: [],
      note: [[]],
    } as any);

    assert.equal(tabs[1].badge, undefined);
    assert.equal(tabs[2].badge, undefined);
  });
});
