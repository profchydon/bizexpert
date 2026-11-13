import assert from "node:assert/strict";
import { test } from "node:test";
import { filterLocationsBySearch } from "./filterLocationsBySearch";
import type { Location } from "@/types/bizexpert";

const rows: Location[] = [
  {
    id: "1",
    businessId: "b",
    name: "Main shop",
    type: "shop",
    address: "Lagos",
    isDefault: true,
    isActive: true,
  },
  {
    id: "2",
    businessId: "b",
    name: "Ikeja warehouse",
    type: "warehouse",
    isDefault: false,
    isActive: true,
  },
];

test("filterLocationsBySearch matches name and type", () => {
  assert.equal(filterLocationsBySearch(rows, "ware").length, 1);
  assert.equal(filterLocationsBySearch(rows, "shop").length, 1);
  assert.equal(filterLocationsBySearch(rows, "").length, 2);
});
