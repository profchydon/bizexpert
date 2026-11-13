import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { IOrder } from "@/types/orders";
import { getStorageSummary } from "./orderStorageSummary";

describe("getStorageSummary", () => {
  it("returns nulls when no storage data exists", () => {
    const summary = getStorageSummary({ sub_orders: [{}, {}] } as never);
    assert.equal(summary.warehouse, null);
    assert.equal(summary.duration, null);
  });

  it("reads the first real warehouse location and duration", () => {
    const order = {
      sub_orders: [
        { storage_location: "  ", storage_duration: "" },
        { storage_location: "Frankfurt DC", storage_duration: "6 months" },
      ],
    } as unknown as IOrder;
    const summary = getStorageSummary(order);
    assert.equal(summary.warehouse, "Frankfurt DC");
    assert.equal(summary.duration, "6 months");
  });

  it("formats a numeric duration into months", () => {
    assert.equal(
      getStorageSummary({
        sub_orders: [{ storage_duration: 1 }],
      } as never).duration,
      "1 month",
    );
    assert.equal(
      getStorageSummary({
        sub_orders: [{ storage_duration: 12 }],
      } as never).duration,
      "12 months",
    );
  });
});
