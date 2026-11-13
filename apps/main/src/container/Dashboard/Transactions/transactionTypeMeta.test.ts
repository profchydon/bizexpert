import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectTransactionTypes,
  getTransactionTypeMeta,
  resolveTransactionTypeValues,
} from "./transactionTypeMeta";

describe("getTransactionTypeMeta", () => {
  it("uses design colors for onboarding, buy-to-storage, offboarding, and storage", () => {
    assert.deepEqual(getTransactionTypeMeta("onboarding"), {
      label: "Onboarding",
      color: "success",
    });
    assert.deepEqual(getTransactionTypeMeta("buy-to-storage"), {
      label: "Buy to Storage",
      color: "purple",
    });
    assert.deepEqual(getTransactionTypeMeta("offboarding"), {
      label: "Offboarding",
      color: "warning",
    });
    assert.deepEqual(getTransactionTypeMeta("storage_order"), {
      label: "Storage",
      color: "blue-light",
    });
  });

  it("covers API-only types with the closest theme color", () => {
    assert.deepEqual(getTransactionTypeMeta("storage_to_employee"), {
      label: "Storage To Employee",
      color: "blue",
    });
    assert.deepEqual(getTransactionTypeMeta("deployment"), {
      label: "Deployment",
      color: "blue",
    });
    assert.equal(getTransactionTypeMeta("custom_flow")?.color, "gray");
    assert.equal(getTransactionTypeMeta("custom_flow")?.label, "Custom Flow");
  });
});

describe("collectTransactionTypes", () => {
  it("dedupes types and skips service fees", () => {
    assert.deepEqual(
      collectTransactionTypes([
        "onboarding",
        "Onboarding",
        "Service Fee",
        "buy_to_storage",
        undefined,
      ]),
      ["onboarding", "buy_to_storage"],
    );
  });
});

describe("resolveTransactionTypeValues", () => {
  it("prefers associated-order types and falls back to invoice items", () => {
    assert.deepEqual(
      resolveTransactionTypeValues({
        multiple_order_details: [{ type: "storage_to_employee" }],
        items_details: [{ type: "deployment" }, { type: "Service Fee" }],
      }),
      ["storage_to_employee"],
    );
    assert.deepEqual(
      resolveTransactionTypeValues({
        multiple_order_details: [],
        items_details: [{ type: "deployment" }, { type: "Service Fee" }],
      }),
      ["deployment"],
    );
  });
});
