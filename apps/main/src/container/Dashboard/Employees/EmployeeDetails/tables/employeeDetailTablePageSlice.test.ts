import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EMPLOYEE_DETAIL_TABLE_PAGE_SIZE,
  getEmployeeDetailPageSlice,
  getEmployeeDetailTotalPages,
} from "./employeeDetailTablePageSlice";

describe("employeeDetailTablePageSlice", () => {
  it("uses five rows per page", () => {
    assert.equal(EMPLOYEE_DETAIL_TABLE_PAGE_SIZE, 5);
  });

  it("calculates total pages from row count", () => {
    assert.equal(getEmployeeDetailTotalPages(0), 1);
    assert.equal(getEmployeeDetailTotalPages(5), 1);
    assert.equal(getEmployeeDetailTotalPages(6), 2);
    assert.equal(getEmployeeDetailTotalPages(13), 3);
  });

  it("returns the requested page slice and hides pagination for short lists", () => {
    const rows = Array.from({ length: 13 }, (_, index) => ({
      id: String(index),
    }));

    assert.deepEqual(getEmployeeDetailPageSlice(rows, 1), {
      pageRows: rows.slice(0, 5),
      currentPage: 1,
      totalPages: 3,
      showPagination: true,
    });

    assert.deepEqual(getEmployeeDetailPageSlice(rows.slice(0, 4), 2), {
      pageRows: rows.slice(0, 4),
      currentPage: 1,
      totalPages: 1,
      showPagination: false,
    });
  });

  it("clamps out-of-range page numbers", () => {
    const rows = Array.from({ length: 8 }, (_, index) => ({
      id: String(index),
    }));
    const result = getEmployeeDetailPageSlice(rows, 99);

    assert.equal(result.currentPage, 2);
    assert.deepEqual(
      result.pageRows.map((row) => row.id),
      ["5", "6", "7"],
    );
  });
});
