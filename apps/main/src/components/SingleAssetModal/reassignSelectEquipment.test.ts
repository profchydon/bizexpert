import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { REASSIGN_EQUIPMENT_OPTIONS } from "./reassignSelectEquipmentOptions";

describe("ReassignSelectEquipment modal", () => {
  it("uses reference RadioCard modal shell and base buttons", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/SingleAssetModal/ReassignSelectEquipment.tsx",
      ),
      "utf8",
    );

    assert.match(source, /RadioCardGroup/);
    assert.match(source, /RadioCard/);
    assert.match(source, /FeaturedIcon/);
    assert.match(source, /CloseButton/);
    assert.match(source, /Button/);
    assert.doesNotMatch(source, /Checkbox/);
    assert.doesNotMatch(source, /next\/image/);
  });

  it("keeps reassignment option ids for flow routing", () => {
    assert.deepEqual(
      REASSIGN_EQUIPMENT_OPTIONS.map((option) => option.id),
      ["System reassignment", "Off-boarding equipment"],
    );
  });
});
