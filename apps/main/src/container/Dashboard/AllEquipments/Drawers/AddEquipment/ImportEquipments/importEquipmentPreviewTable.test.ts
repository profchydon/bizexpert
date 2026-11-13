import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("ImportEquipmentPreviewTable", () => {
  it("renders combined preview values on one line", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/ImportEquipments/ImportEquipmentPreviewTable.tsx",
      ),
      "utf8",
    );

    assert.match(source, /formatImportMakeModel/);
    assert.match(source, /formatImportAssetSerial/);
    assert.match(source, /formatImportAssetTypeYear/);
    assert.match(source, /importEquipmentPreviewTableScrollClass/);
    assert.match(source, /importEquipmentPreviewActionHeadCellClass/);
    assert.match(source, /importEquipmentPreviewTableClass/);
    assert.match(source, /link-gray/);
    assert.match(source, /link-color/);
    assert.doesNotMatch(source, /flex flex-col gap-y-1/);
  });
});

describe("ImportEquipmentTable", () => {
  it("uses the preview table shell instead of legacy shadcn table cells", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/ImportEquipments/ImportEquipmentTable.tsx",
      ),
      "utf8",
    );

    assert.match(source, /ImportEquipmentPreviewTable/);
    assert.match(source, /pt-6/);
    assert.match(source, /submitImportEquipmentBulk/);
    assert.doesNotMatch(source, /@\/components\/ui\/table/);
  });
});

describe("submitImportEquipmentBulk", () => {
  it("posts unassigned status in lowercase", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/ImportEquipments/submitImportEquipmentBulk.ts",
      ),
      "utf8",
    );

    assert.match(
      source,
      /status: !rest\?\.assignee \? "unassigned" : "Assigned"/,
    );
    assert.doesNotMatch(source, /status: !rest\?\.assignee \? "Unassigned"/);
  });
});
