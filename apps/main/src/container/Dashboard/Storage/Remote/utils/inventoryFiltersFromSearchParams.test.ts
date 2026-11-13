import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { INITIAL_FILTERS } from "../types/storage";
import { inventoryFiltersFromSearchParams } from "./inventoryFiltersFromSearchParams";

describe("inventoryFiltersFromSearchParams", () => {
  it("enables needsAction when needs_action=1", () => {
    const params = new URLSearchParams("needs_action=1");
    const filters = inventoryFiltersFromSearchParams(params);

    assert.equal(filters.needsAction, true);
    assert.equal(filters.status, INITIAL_FILTERS.status);
    assert.equal(filters.grouped, false);
  });

  it("enables needsAction when needs_action=true", () => {
    const params = new URLSearchParams("needs_action=true");
    assert.equal(inventoryFiltersFromSearchParams(params).needsAction, true);
  });

  it("leaves needsAction false when param is missing or invalid", () => {
    assert.equal(
      inventoryFiltersFromSearchParams(new URLSearchParams()).needsAction,
      false,
    );
    assert.equal(
      inventoryFiltersFromSearchParams(new URLSearchParams("needs_action=0"))
        .needsAction,
      false,
    );
  });
});
