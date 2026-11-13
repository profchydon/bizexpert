import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EQUIPMENT_API_PAGE_SIZE } from "./equipmentApiPageSize.ts";

describe("equipmentApiPageSize", () => {
  it("uses the equipments API page size limit", () => {
    assert.equal(EQUIPMENT_API_PAGE_SIZE, 15);
  });
});
