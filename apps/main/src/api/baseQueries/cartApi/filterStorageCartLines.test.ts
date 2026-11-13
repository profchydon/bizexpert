import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filterStorageCartLinesForCompany } from "./filterStorageCartLines";

describe("filterStorageCartLinesForCompany", () => {
  const lines = [
    {
      type: "storage_device_check" as const,
      equipment_id: "eq-1",
      company_id: "company-a",
    },
    {
      type: "storage_disposal" as const,
      equipment_id: "eq-2",
      company_id: "company-b",
    },
    {
      type: "storage_device_check" as const,
      company_id: "company-a",
    },
  ];

  it("keeps only storage lines for the active workspace company", () => {
    const scoped = filterStorageCartLinesForCompany(lines, "company-a");
    assert.equal(scoped.length, 1);
    assert.equal(scoped[0]?.equipment_id, "eq-1");
  });

  it("returns no storage lines when the workspace company id is missing", () => {
    assert.deepEqual(filterStorageCartLinesForCompany(lines, undefined), []);
  });
});
