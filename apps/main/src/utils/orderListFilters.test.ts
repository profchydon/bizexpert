import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeOrderListFilters,
  orderListFilterQuery,
  readOrderListFilters,
  writeOrderListFilters,
} from "./orderListFilters";

describe("order list filters", () => {
  it("reads only the filter keys that are set", () => {
    const search = new URLSearchParams(
      "page=3&status=completed&country=Nigeria&empty=",
    );
    assert.deepEqual(readOrderListFilters(search), {
      status: "completed",
      country: "Nigeria",
    });
  });

  it("writes filters and clears ones that were removed", () => {
    const params = new URLSearchParams(
      "status=completed&page=3&type=onboarding",
    );
    writeOrderListFilters(
      params,
      normalizeOrderListFilters({ status: "completed", type: "  " }),
    );
    assert.equal(params.get("status"), "completed");
    assert.equal(params.get("type"), null);
    assert.equal(params.get("page"), "3");
    assert.deepEqual(orderListFilterQuery(readOrderListFilters(params)), {
      status: "completed",
    });
  });
});
