import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getTransactionStatusMeta } from "./transactionStatusMeta";

describe("getTransactionStatusMeta", () => {
  it("maps paid API statuses to the design Paid pill", () => {
    assert.deepEqual(getTransactionStatusMeta("Successful"), {
      key: "paid",
      label: "Paid",
      color: "success",
    });
    assert.equal(getTransactionStatusMeta("Fulfilled").label, "Paid");
    assert.equal(getTransactionStatusMeta("PAID").key, "paid");
  });

  it("maps pending, failed, cancelled, and voided instances", () => {
    assert.equal(getTransactionStatusMeta("Pending").key, "pending");
    assert.equal(getTransactionStatusMeta("Awaiting Payment").key, "pending");
    assert.equal(getTransactionStatusMeta("OPEN").key, "pending");
    assert.equal(getTransactionStatusMeta("Failed").color, "error");
    assert.equal(getTransactionStatusMeta("Canceled").label, "Cancelled");
    assert.equal(getTransactionStatusMeta("Refunded").key, "voided");
    assert.equal(getTransactionStatusMeta("VOID").key, "voided");
    assert.equal(getTransactionStatusMeta("Partial Refund").color, "blue");
  });

  it("falls back to a gray pill for unknown statuses", () => {
    assert.deepEqual(getTransactionStatusMeta("Mystery"), {
      key: "cancelled",
      label: "Mystery",
      color: "gray",
    });
  });
});
