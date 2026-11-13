import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isOrderUpdatesInitialLoading } from "./orderUpdatesStatus";

describe("isOrderUpdatesInitialLoading", () => {
  it("is true before the first page resolves", () => {
    assert.equal(
      isOrderUpdatesInitialLoading({
        canLoad: true,
        isError: false,
        activityCount: 0,
        currentPage: 0,
      }),
      true,
    );
  });

  it("is false after an empty first page so the empty state can show", () => {
    assert.equal(
      isOrderUpdatesInitialLoading({
        canLoad: true,
        isError: false,
        activityCount: 0,
        currentPage: 1,
      }),
      false,
    );
  });

  it("is false once activities are present", () => {
    assert.equal(
      isOrderUpdatesInitialLoading({
        canLoad: true,
        isError: false,
        activityCount: 2,
        currentPage: 1,
      }),
      false,
    );
  });

  it("is false when the first page failed", () => {
    assert.equal(
      isOrderUpdatesInitialLoading({
        canLoad: true,
        isError: true,
        activityCount: 0,
        currentPage: 0,
      }),
      false,
    );
  });

  it("is false when the order cannot be loaded", () => {
    assert.equal(
      isOrderUpdatesInitialLoading({
        canLoad: false,
        isError: false,
        activityCount: 0,
        currentPage: 0,
      }),
      false,
    );
  });
});
