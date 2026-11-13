import assert from "node:assert/strict";
import { test } from "node:test";
import { mapDashboardCountrySummary } from "./mapDashboardCountrySummary";
import { ISO_NUMERIC_TO_ALPHA2 } from "./types";

test("mapDashboardCountrySummary maps dashboard API rows to country entries", () => {
  const [entry] = mapDashboardCountrySummary([
    {
      country_id: "1",
      country_code: "ng",
      country: "Nigeria",
      employee_count: 12,
      equipment_count: 8,
      equipment_in_storage_count: 3,
      catalog_count: 2,
    },
  ]);

  assert.equal(entry.code, "NG");
  assert.equal(entry.name, "Nigeria");
  assert.equal(entry.employees, 12);
  assert.equal(entry.storage, 3);
});

test("ISO_NUMERIC_TO_ALPHA2 includes common dashboard countries", () => {
  assert.equal(ISO_NUMERIC_TO_ALPHA2["566"], "NG");
  assert.equal(ISO_NUMERIC_TO_ALPHA2["840"], "US");
  assert.equal(ISO_NUMERIC_TO_ALPHA2["826"], "GB");
});
