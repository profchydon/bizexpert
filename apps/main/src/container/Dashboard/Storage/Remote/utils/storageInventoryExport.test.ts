import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { INITIAL_FILTERS } from "../types/storage";
import { buildInStorageExportParams } from "./buildInStorageExportParams";
import {
  buildStorageInventoryExportUrl,
  buildStorageInventorySelectedExportUrl,
  getStorageInventoryExportFilename,
} from "./exportStorageInventory";

describe("buildInStorageExportParams", () => {
  it("maps active inventory filters without pagination", () => {
    const params = buildInStorageExportParams({
      filters: {
        ...INITIAL_FILTERS,
        search: "macbook",
        countryId: "country-1",
        source: "buy_to_storage",
        status: "available",
        deviceType: "Laptop",
      },
      sort: { column: "entry", direction: "descending" },
    });

    assert.equal(params.search, "macbook");
    assert.equal(params.country_id, "country-1");
    assert.equal(params.source, "buy_to_storage");
    assert.equal(params.storage_status, "in_storage");
    assert.equal(params.asset_type, "Laptop/Workstation");
    assert.equal(params.page, undefined);
    assert.equal(params.per_page, undefined);
    assert.equal((params as { ids?: string }).ids, undefined);
  });
});

describe("exportStorageInventory", () => {
  it("builds the filtered in-storage export endpoint with query params", () => {
    const url = buildStorageInventoryExportUrl("company-1", {
      search: "macbook",
      needs_action: true,
      sort_by: "entry_date",
      sort_dir: "desc",
    });

    assert.match(
      url,
      /\/companies\/company-1\/equipments\/in-storage\/export\?/,
    );
    assert.match(url, /search=macbook/);
    assert.match(url, /needs_action=1/);
    assert.match(url, /sort_by=entry_date/);
    assert.match(url, /sort_dir=desc/);
  });

  it("builds the selected in-storage export endpoint", () => {
    const url = buildStorageInventorySelectedExportUrl("company-1");
    assert.match(
      url,
      /\/companies\/company-1\/equipments\/in-storage\/export\/selected$/,
    );
  });

  it("reads the server filename from content-disposition", () => {
    assert.equal(
      getStorageInventoryExportFilename('attachment; filename="storage.csv"'),
      "storage.csv",
    );
    assert.equal(
      getStorageInventoryExportFilename(null),
      "Rayda_Storage_Inventory.csv",
    );
  });
});
