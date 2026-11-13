import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("storage inventory export wiring", () => {
  it("uses GET filtered export for the header Export button", () => {
    const storagePage = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/StoragePage.tsx",
      ),
      "utf8",
    );
    const inventoryTab = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/components/InventoryTab.tsx",
      ),
      "utf8",
    );
    const hook = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/useStorageInventoryExport.ts",
      ),
      "utf8",
    );

    assert.match(storagePage, /exportFilteredInventory/);
    assert.match(storagePage, /handleHeaderExport/);
    assert.match(storagePage, /inventoryExportCtxRef/);
    assert.match(inventoryTab, /exportSelection/);
    assert.match(hook, /exportFilteredInventory/);
    assert.match(hook, /axiosServer\.get/);
    assert.match(hook, /getStorageExportAuth/);
    assert.doesNotMatch(inventoryTab, /downloadInventoryCsv/);
  });

  it("uses POST selected export only for bulk selection", () => {
    const storagePage = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/StoragePage.tsx",
      ),
      "utf8",
    );
    const controller = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/useInventoryTabController.ts",
      ),
      "utf8",
    );
    const hook = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/useStorageInventoryExport.ts",
      ),
      "utf8",
    );

    assert.match(storagePage, /exportSelectedInventory/);
    assert.match(controller, /exportSelectedInventory/);
    assert.doesNotMatch(controller, /useStorageInventoryExport\(/);
    assert.match(hook, /exportSelectedInventory/);
    assert.match(hook, /buildInStorageSelectedExportBody/);
    assert.match(hook, /axiosServer\.post/);
  });
});
