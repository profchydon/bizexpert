import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("EquipmentScoreGauge", () => {
  it("uses theme utility tokens instead of hardcoded hex colors", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentDetail/EquipmentScoreGauge.tsx",
      ),
      "utf8",
    );

    assert.match(source, /utility-brand-100/);
    assert.match(source, /utility-error-100/);
    assert.doesNotMatch(source, /#[0-9A-Fa-f]{3,8}/);
  });
});
