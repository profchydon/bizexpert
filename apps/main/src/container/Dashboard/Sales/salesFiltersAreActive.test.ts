import assert from "node:assert/strict";
import { test } from "node:test";
import {
  emptySalesFilters,
  salesFiltersAreActive,
} from "./salesFiltersAreActive";

test("salesFiltersAreActive is false for empty filters", () => {
  assert.equal(salesFiltersAreActive(emptySalesFilters), false);
});

test("salesFiltersAreActive is true when any filter is set", () => {
  assert.equal(
    salesFiltersAreActive({ ...emptySalesFilters, search: "sal" }),
    true,
  );
  assert.equal(
    salesFiltersAreActive({ ...emptySalesFilters, status: "completed" }),
    true,
  );
  assert.equal(
    salesFiltersAreActive({ ...emptySalesFilters, startDate: "2026-11-01" }),
    true,
  );
});
