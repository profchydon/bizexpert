import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { INITIAL_FILTERS } from "../types/storage";
import { buildInStorageInventoryParams } from "./buildInStorageInventoryParams";

describe("buildInStorageInventoryParams", () => {
  it("maps inventory filters, sort, and pagination to API params", () => {
    const params = buildInStorageInventoryParams({
      filters: {
        ...INITIAL_FILTERS,
        search: "macbook",
        countryId: "88730c2b-90a9-47e3-bd11-03b1fc414d7d",
        source: "buy_to_storage",
        grade: "A",
        status: "available",
        wipe: "wiped",
        deviceType: "Laptop",
        needsAction: true,
      },
      sort: { column: "entry", direction: "descending" },
      page: 2,
      pageSize: 15,
    });

    assert.equal(params.search, "macbook");
    assert.equal(params.country_id, "88730c2b-90a9-47e3-bd11-03b1fc414d7d");
    assert.equal(params.source, "buy_to_storage");
    assert.equal(params.grade, "A");
    assert.equal(params.storage_status, "in_storage");
    assert.equal(params.wipe_status, "wiped");
    assert.equal(params.asset_type, "Laptop/Workstation");
    assert.equal(params.needs_action, true);
    assert.equal(params.page, 2);
    assert.equal(params.per_page, 15);
    assert.equal(params.sort_by, "entry_date");
    assert.equal(params.sort_dir, "desc");
  });

  it("passes grouped pagination through with the same page size", () => {
    const params = buildInStorageInventoryParams({
      filters: { ...INITIAL_FILTERS, grouped: true },
      sort: { column: "entry", direction: "ascending" },
      page: 3,
      pageSize: 15,
      grouped: true,
    });

    assert.equal(params.page, 3);
    assert.equal(params.per_page, 15);
    assert.equal(params.group_by, "country");
  });
});
