import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { IOrder } from "@/types/orders";
import { buildOrderContentLines, getSubOrders } from "./orderContentLines";

function asset(name: string, amount?: string) {
  return {
    id: `${name}-${amount ?? "na"}`,
    name,
    type: "Computer",
    asset_pricing: amount ? { amount, currency: { symbol: "£" } } : undefined,
  };
}

describe("getSubOrders", () => {
  it("reads both array and paginated shapes", () => {
    assert.equal(getSubOrders({ sub_orders: [{}, {}] } as never).length, 2);
    assert.equal(
      getSubOrders({ sub_orders: { data: [{}] } } as never).length,
      1,
    );
    assert.equal(getSubOrders(undefined).length, 0);
  });
});

describe("buildOrderContentLines", () => {
  it("groups identical assets and sums quantity + amount", () => {
    const order = {
      currency: "£",
      sub_orders: [
        { assets: [asset("MacBook Pro", "1000")] },
        { assets: [asset("MacBook Pro", "1000")] },
      ],
    } as unknown as IOrder;

    const lines = buildOrderContentLines(order);
    assert.equal(lines.length, 1);
    assert.equal(lines[0].quantity, 2);
    assert.equal(lines[0].unitPrice, 1000);
    assert.equal(lines[0].amount, 2000);
    assert.equal(lines[0].currencySymbol, "£");
  });

  it("falls back to equipment when a sub order has no assets", () => {
    const order = {
      currency: "$",
      sub_orders: [
        {
          quantity: 3,
          equipment: {
            id: "eq-1",
            title: "Dell Monitor",
            type: "Monitor",
            purchase_price: "150",
          },
        },
      ],
    } as unknown as IOrder;

    const lines = buildOrderContentLines(order);
    assert.equal(lines.length, 1);
    assert.equal(lines[0].name, "Dell Monitor");
    assert.equal(lines[0].quantity, 3);
    assert.equal(lines[0].amount, 450);
  });

  it("includes equipment serial on order content lines", () => {
    const order = {
      currency: "£",
      sub_orders: [
        {
          quantity: 1,
          equipment: {
            id: "eq-bts",
            title: "HP Probook 440",
            type: "Laptop/Workstation",
            purchase_price: "792",
            serial_number: "QASTODBE84X1",
          },
        },
      ],
    } as unknown as IOrder;

    const lines = buildOrderContentLines(order);
    assert.equal(lines[0].serialNumber, "QASTODBE84X1");
  });

  it("uses null pricing when none is available", () => {
    const order = {
      sub_orders: [{ assets: [asset("USB-C Hub")] }],
    } as unknown as IOrder;

    const lines = buildOrderContentLines(order);
    assert.equal(lines[0].unitPrice, null);
    assert.equal(lines[0].amount, null);
  });

  it("maps storage sub orders that only have action and equipment_id", () => {
    const order = {
      currency: "£",
      sub_orders: [
        {
          id: "sto-1",
          action: "device_check",
          equipment_id: "eq-1",
          amount: 25,
        },
        {
          id: "sto-2",
          action: "dispose",
          equipment_id: "eq-2",
          amount: 30,
        },
      ],
    } as unknown as IOrder;

    const lines = buildOrderContentLines(order);
    assert.equal(lines.length, 2);
    assert.equal(lines[0].name, "Device");
    assert.equal(lines[0].type, "Device check");
    assert.equal(lines[0].quantity, 1);
    assert.equal(lines[0].amount, 25);
    assert.equal(lines[1].type, "Disposal");
    assert.equal(lines[1].amount, 30);
  });

  it("groups identical storage actions at the same price", () => {
    const order = {
      currency: "£",
      sub_orders: [
        { action: "device_check", equipment_id: "eq-1", amount: 25 },
        { action: "device_check", equipment_id: "eq-2", amount: 25 },
      ],
    } as unknown as IOrder;

    const lines = buildOrderContentLines(order);
    assert.equal(lines.length, 1);
    assert.equal(lines[0].quantity, 2);
    assert.equal(lines[0].amount, 50);
  });
});
