import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { paginateEquipmentRows } from "./paginateEquipmentRows";

describe("paginateEquipmentRows", () => {
  it("slices rows for the requested page", () => {
    const rows = Array.from({ length: 25 }, (_, index) => index + 1);
    const pageTwo = paginateEquipmentRows(rows, 2, 10);

    assert.equal(pageTwo.currentPage, 2);
    assert.equal(pageTwo.lastPage, 3);
    assert.deepEqual(pageTwo.rows, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });
});
