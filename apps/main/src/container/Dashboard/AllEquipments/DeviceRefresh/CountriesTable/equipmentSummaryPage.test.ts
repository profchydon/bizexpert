import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractEquipmentSummaryPage } from "./equipmentSummaryPage";

describe("extractEquipmentSummaryPage", () => {
  it("reads rows and pagination from the nested data payload", () => {
    const result = extractEquipmentSummaryPage({
      data: [
        {
          country_id: "c-1",
          country_name: "United Kingdom",
          country_code: "GB",
          overdue_count: 2,
        },
      ],
      current_page: 2,
      last_page: 5,
      total: 42,
    });

    assert.equal(result.countries.length, 1);
    assert.equal(result.currentPage, 2);
    assert.equal(result.lastPage, 5);
    assert.equal(result.total, 42);
  });

  it("returns safe defaults when payload is missing", () => {
    assert.deepEqual(extractEquipmentSummaryPage(undefined), {
      countries: [],
      currentPage: 1,
      lastPage: 1,
      total: 0,
    });
  });
});
