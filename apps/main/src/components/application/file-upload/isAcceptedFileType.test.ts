import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAcceptedFileType } from "./isAcceptedFileType";

describe("isAcceptedFileType", () => {
  it("accepts csv and xlsx extensions", () => {
    const csv = new File(["a"], "employees.csv", { type: "text/csv" });
    const xlsx = new File(["a"], "employees.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    assert.equal(isAcceptedFileType(csv, ".csv,.xlsx"), true);
    assert.equal(isAcceptedFileType(xlsx, ".csv,.xlsx"), true);
  });

  it("rejects unsupported extensions", () => {
    const pdf = new File(["a"], "employees.pdf", { type: "application/pdf" });

    assert.equal(isAcceptedFileType(pdf, ".csv,.xlsx"), false);
  });
});
