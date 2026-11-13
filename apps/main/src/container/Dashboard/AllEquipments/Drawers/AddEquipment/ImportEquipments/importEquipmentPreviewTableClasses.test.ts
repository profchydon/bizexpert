import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  importEquipmentPreviewTableClass,
  importEquipmentPreviewTableScrollClass,
  importEquipmentPreviewTableShellClass,
} from "./importEquipmentPreviewTableClasses.ts";

describe("importEquipmentPreviewTableClasses", () => {
  it("allows horizontal scrolling instead of clipping wide tables", () => {
    assert.match(importEquipmentPreviewTableScrollClass, /overflow-x-auto/);
    assert.match(importEquipmentPreviewTableScrollClass, /min-w-0/);
    assert.doesNotMatch(
      importEquipmentPreviewTableShellClass,
      /overflow-hidden/,
    );
    assert.match(importEquipmentPreviewTableShellClass, /w-max min-w-full/);
    assert.match(importEquipmentPreviewTableClass, /min-w-max/);
  });
});

describe("ImportEquipmentTable layout", () => {
  it("keeps the preview region scrollable inside the slideout flex column", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/ImportEquipments/ImportEquipmentTable.tsx",
      ),
      "utf8",
    );

    assert.match(source, /min-w-0/);
    assert.match(source, /overflow-y-auto/);
    assert.doesNotMatch(source, /overflow-x-auto/);
  });
});
