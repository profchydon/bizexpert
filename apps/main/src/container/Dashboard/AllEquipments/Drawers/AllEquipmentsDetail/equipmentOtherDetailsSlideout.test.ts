import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("EquipmentOtherDetails slideout", () => {
  it("uses SlideoutMenu shell and reference content layout", () => {
    const shell = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AllEquipmentsDetail/EquipmentOtherDetails.tsx",
      ),
      "utf8",
    );
    const content = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AllEquipmentsDetail/EquipmentOtherDetailsContent.tsx",
      ),
      "utf8",
    );

    assert.match(shell, /SlideoutMenu/);
    assert.match(shell, /EquipmentOtherDetailsContent/);
    assert.doesNotMatch(shell, /DrawerRight/);
    assert.match(content, /parseEquipmentOtherDetailChips/);
    assert.match(content, /ring-1 ring-secondary ring-inset/);
    assert.match(content, /FileIcon/);
  });
});

describe("formatEquipmentDescription", () => {
  it("strips HTML from equipment descriptions", async () => {
    const { formatEquipmentDescription, parseEquipmentOtherDetailChips } =
      await import("./equipmentDetailFormat.ts");

    assert.equal(
      formatEquipmentDescription("<p>Black, Analog</p>"),
      "Black, Analog",
    );
    assert.deepEqual(parseEquipmentOtherDetailChips('["Wireless"]'), [
      "Wireless",
    ]);
  });
});
