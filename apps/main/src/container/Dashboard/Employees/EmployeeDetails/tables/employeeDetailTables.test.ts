import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapApiOrderStatus } from "./mapApiOrderStatus";
import { sortEmployeeDetailRows } from "./sortEmployeeDetailRows";

describe("mapApiOrderStatus", () => {
  it("maps awaiting payment to pending-payment", () => {
    assert.equal(mapApiOrderStatus("awaiting"), "pending-payment");
  });

  it("maps completed statuses to completed", () => {
    assert.equal(mapApiOrderStatus("completed"), "completed");
    assert.equal(mapApiOrderStatus("order_delivered"), "completed");
  });

  it("defaults unknown statuses to in-progress", () => {
    assert.equal(mapApiOrderStatus("in_progress"), "in-progress");
    assert.equal(mapApiOrderStatus(undefined), "in-progress");
  });
});

describe("sortEmployeeDetailRows", () => {
  it("sorts rows ascending by a numeric column", () => {
    const rows = [
      { id: "b", amount: 20 },
      { id: "a", amount: 5 },
    ];
    const sorted = sortEmployeeDetailRows(
      rows,
      { column: "amount", direction: "ascending" },
      (row, column) => (column === "amount" ? row.amount : ""),
    );
    assert.deepEqual(
      sorted.map((row) => row.id),
      ["a", "b"],
    );
  });

  it("returns original order when no sort column is set", () => {
    const rows = [{ id: "a" }, { id: "b" }];
    const sorted = sortEmployeeDetailRows(
      rows,
      { column: "", direction: "ascending" },
      () => "",
    );
    assert.deepEqual(sorted, rows);
  });
});
