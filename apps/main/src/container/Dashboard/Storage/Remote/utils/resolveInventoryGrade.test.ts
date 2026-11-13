import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveInventoryGrade } from "./resolveInventoryGrade";

describe("resolveInventoryGrade", () => {
  it("keeps the API letter and label even when the grade is synthetic", () => {
    assert.deepEqual(
      resolveInventoryGrade({
        grade: "A",
        label: "Excellent",
        checked_at: null,
        checked_days_ago: null,
        synthetic: true,
      }),
      {
        grade: "A",
        gradeLabel: "Excellent",
        lastCheckDate: undefined,
        checkedDaysAgo: undefined,
        gradeSynthetic: true,
      },
    );
  });

  it("keeps the API letter and label for a completed check", () => {
    assert.deepEqual(
      resolveInventoryGrade({
        grade: "C",
        label: "Fair",
        checked_at: "2026-08-01",
        checked_days_ago: 12,
        synthetic: false,
      }),
      {
        grade: "C",
        gradeLabel: "Fair",
        lastCheckDate: "2026-08-01",
        checkedDaysAgo: 12,
        gradeSynthetic: false,
      },
    );
  });
});
