import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { IInStorageInventorySummary } from "@/types/equipmentsInStorageInventory";
import { mapInStorageInventorySummary } from "./mapInStorageInventorySummary";

const sample: IInStorageInventorySummary = {
  total_count: 7,
  asset_type_count: 2,
  needs_action_count: 0,
  by_asset_type: [
    { asset_type: "Laptop/Workstation", count: 4 },
    { asset_type: "Tablet", count: 3 },
  ],
  by_status: [
    { status: "in_storage", count: 7 },
    { status: "pending_device_check", count: 0 },
  ],
  by_country: [
    {
      country_id: "b9bbd993-6556-4186-a00b-61346f9f66be",
      country: "Nigeria",
      country_code: "NG",
      count: 4,
    },
    {
      country_id: "daaa74d5-f5c6-4554-b3c0-02453483a3ea",
      country: "United Kingdom",
      country_code: "GB",
      count: 1,
    },
    {
      country_id: "88730c2b-90a9-47e3-bd11-03b1fc414d7d",
      country: "United States",
      country_code: "US",
      count: 2,
    },
  ],
};

describe("mapInStorageInventorySummary", () => {
  it("maps summary totals and distribution segments", () => {
    const mapped = mapInStorageInventorySummary(sample);

    assert.equal(mapped.totalCount, 7);
    assert.equal(mapped.assetTypeCount, 2);
    assert.equal(mapped.needsActionCount, 0);
    assert.equal(mapped.countries, 3);
    assert.equal(mapped.topCountry, "Nigeria (4)");
    assert.deepEqual(
      mapped.assetSegments.map((s) => s.label),
      ["Laptop", "Tablet"],
    );
    assert.deepEqual(
      mapped.assetSegments.map((s) => s.count),
      [4, 3],
    );
    assert.deepEqual(
      mapped.statusSegments.map((s) => s.key),
      ["available"],
    );
    assert.equal(mapped.statusSegments[0]?.count, 7);
    assert.deepEqual(
      mapped.countrySegments.map((s) => s.label),
      ["Nigeria", "United States", "United Kingdom"],
    );
    assert.deepEqual(
      mapped.countrySegments.map((s) => s.count),
      [4, 2, 1],
    );
    assert.deepEqual(
      mapped.countryOptions.map((c) => c.name),
      ["Nigeria", "United States", "United Kingdom"],
    );
    assert.deepEqual(
      mapped.countryOptions.map((c) => c.code),
      ["NG", "US", "GB"],
    );
  });

  it("returns empty overview data when summary is missing", () => {
    const mapped = mapInStorageInventorySummary(undefined);
    assert.equal(mapped.totalCount, 0);
    assert.deepEqual(mapped.assetSegments, []);
  });

  it("maps live asset-type aliases and pending-check status buckets", () => {
    const mapped = mapInStorageInventorySummary({
      ...sample,
      asset_type_count: 4,
      by_asset_type: [
        { asset_type: "Laptop/Workstation", count: 2 },
        { asset_type: "Tablet", count: 2 },
        { asset_type: "Monitor", count: 2 },
        { asset_type: "Phones", count: 1 },
      ],
      by_status: [
        { status: "in_storage", count: 5 },
        { status: "pending_device_check", count: 2 },
      ],
    });

    assert.deepEqual(
      mapped.assetSegments.map((s) => [s.key, s.count]),
      [
        ["Laptop", 2],
        ["Tablet", 2],
        ["Display", 2],
        ["Smartphone", 1],
      ],
    );
    assert.deepEqual(
      mapped.statusSegments.map((s) => [s.key, s.label, s.count]),
      [
        ["available", "In storage", 5],
        ["pending_check", "Pending Device Check", 2],
      ],
    );
  });
});
