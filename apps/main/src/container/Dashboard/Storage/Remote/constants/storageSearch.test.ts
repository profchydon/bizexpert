import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  extraStorageOrderPages,
  normalizeStorageSearchQuery,
  paginateStorageOrders,
  storageOrderMatchesSearch,
} from "./storageSearch";

const offboardingOrder = {
  id: "01a00625-b154-710a-b205-3af04e3f70f5",
  orderNumber: "RE-OFF-A70AD-2026",
  deviceName: "Apple Macbook Air M3",
  serialNumber: "SDFGTA",
};

describe("storageOrderMatchesSearch", () => {
  it("matches RE-OFF order numbers with a re-off prefix", () => {
    assert.equal(storageOrderMatchesSearch(offboardingOrder, "re-off"), true);
    assert.equal(storageOrderMatchesSearch(offboardingOrder, " RE-OFF "), true);
    assert.equal(storageOrderMatchesSearch(offboardingOrder, "a70ad"), true);
  });

  it("matches device name and serial independently of the order id", () => {
    assert.equal(storageOrderMatchesSearch(offboardingOrder, "macbook"), true);
    assert.equal(storageOrderMatchesSearch(offboardingOrder, "sdfgta"), true);
    assert.equal(storageOrderMatchesSearch(offboardingOrder, "ste-"), false);
  });

  it("treats a blank query as a match", () => {
    assert.equal(storageOrderMatchesSearch(offboardingOrder, "  "), true);
  });
});

describe("storage search helpers", () => {
  it("normalizes queries to trimmed lowercase", () => {
    assert.equal(normalizeStorageSearchQuery(" Re-Off "), "re-off");
  });

  it("lists extra pages after page 1", () => {
    assert.deepEqual(extraStorageOrderPages(1), []);
    assert.deepEqual(extraStorageOrderPages(3), [2, 3]);
  });

  it("slices a page of results", () => {
    assert.deepEqual(paginateStorageOrders([1, 2, 3, 4, 5], 2, 2), [3, 4]);
  });
});
