import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEVICE_REFRESH_COUNTRIES_PAGE_SIZE,
  paginateClientPage,
} from "./paginateClientPage";

const items = Array.from({ length: 25 }, (_, index) => ({
  country_id: `c-${index + 1}`,
}));

describe("paginateClientPage", () => {
  it("returns the first page of items", () => {
    const result = paginateClientPage(items, 1);

    assert.equal(result.items.length, DEVICE_REFRESH_COUNTRIES_PAGE_SIZE);
    assert.equal(result.currentPage, 1);
    assert.equal(result.lastPage, 3);
    assert.equal(result.total, 25);
    assert.equal(result.items[0]?.country_id, "c-1");
  });

  it("returns the final partial page", () => {
    const result = paginateClientPage(items, 3);

    assert.equal(result.items.length, 5);
    assert.equal(result.currentPage, 3);
    assert.equal(result.items[0]?.country_id, "c-21");
  });

  it("clamps invalid page numbers", () => {
    assert.equal(paginateClientPage(items, 0).currentPage, 1);
    assert.equal(paginateClientPage(items, 99).currentPage, 3);
  });

  it("handles empty lists", () => {
    assert.deepEqual(paginateClientPage([], 1), {
      items: [],
      currentPage: 1,
      lastPage: 1,
      total: 0,
    });
  });
});
