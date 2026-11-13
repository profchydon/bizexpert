import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ISubOrder } from "@/types/orders";
import { buildCancelEmployees } from "./cancel/cancelData";
import {
  assetCustomerPrice,
  subOrderCustomerAmount,
} from "./subOrderCustomerPricing";

describe("subOrderCustomerPricing", () => {
  it("prefers total_amount over the raw vendor amount field", () => {
    const subOrder = {
      total_amount: 1850,
      amount: "3000000",
      assets: [{ asset_pricing: { amount: "1850" } }],
    } as unknown as ISubOrder;

    assert.equal(subOrderCustomerAmount(subOrder), 1850);
  });

  it("sums asset_pricing when total_amount is missing", () => {
    const subOrder = {
      amount: "3000000",
      assets: [
        { asset_pricing: { amount: "900" } },
        { asset_pricing: { amount: "950" } },
      ],
    } as unknown as ISubOrder;

    assert.equal(subOrderCustomerAmount(subOrder), 1850);
  });

  it("reads per-device customer prices from asset_pricing", () => {
    const asset = { asset_pricing: { amount: "1234.5" } } as never;
    assert.equal(assetCustomerPrice(asset), 1234.5);
  });

  it("uses total_amount for buy_to_storage lines", () => {
    const subOrder = {
      type: "buy_to_storage",
      total_amount: 1850,
      amount: "2500000",
      equipment: { purchase_price: "2500000" },
    } as unknown as ISubOrder;

    assert.equal(subOrderCustomerAmount(subOrder), 1850);
  });

  it("does not fall back to equipment purchase_price for buy_to_storage", () => {
    const subOrder = {
      type: "buy_to_storage",
      equipment: { purchase_price: "2500000" },
    } as unknown as ISubOrder;

    assert.equal(subOrderCustomerAmount(subOrder), 0);
  });
});

describe("buildCancelEmployees", () => {
  it("maps device line prices from asset_pricing, not vendor base amount", () => {
    const order = {
      type: "onboarding",
      sub_orders: [
        {
          id: "sub-1",
          employee_id: "emp-1",
          employee_first_name: "Ada",
          employee_last_name: "Lovelace",
          status: "order_placed",
          total_amount: 1850,
          amount: "3000000",
          assets: [
            {
              id: "asset-1",
              name: "MacBook Pro",
              asset_pricing: { amount: "1850", currency: { symbol: "£" } },
            },
          ],
        },
      ],
    } as never;

    const [employee] = buildCancelEmployees(order);
    assert.equal(employee.amount, 1850);
    assert.equal(employee.items[0]?.price, 1850);
  });
});
