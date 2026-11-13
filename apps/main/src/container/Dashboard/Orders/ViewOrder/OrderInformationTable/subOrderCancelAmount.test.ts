import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ISubOrder } from "@/types/orders";
import { calculateSubOrderTotalAmount } from "./subOrderCancelAmount";

describe("calculateSubOrderTotalAmount", () => {
  it("stringifies a numeric sub-order amount", () => {
    const subOrder = { amount: 25 } as unknown as ISubOrder;
    assert.equal(calculateSubOrderTotalAmount(subOrder), "25");
  });

  it("keeps a string sub-order amount", () => {
    const subOrder = { amount: "59.12" } as unknown as ISubOrder;
    assert.equal(calculateSubOrderTotalAmount(subOrder), "59.12");
  });

  it("sums asset prices when amount is missing", () => {
    const subOrder = {
      assets: [
        { asset_pricing: { amount: "10" } },
        { asset_pricing: { amount: "15" } },
      ],
    } as unknown as ISubOrder;
    assert.equal(calculateSubOrderTotalAmount(subOrder), "25");
  });

  it("uses equipment purchase price when assets are empty", () => {
    const subOrder = {
      assets: [],
      equipment: { purchase_price: "1800" },
    } as unknown as ISubOrder;
    assert.equal(calculateSubOrderTotalAmount(subOrder), "1800");
  });

  it("returns 0 when no pricing is available", () => {
    assert.equal(calculateSubOrderTotalAmount(undefined), "0");
  });
});
