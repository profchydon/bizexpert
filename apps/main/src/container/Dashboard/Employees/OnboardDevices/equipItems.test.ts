import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  addItem,
  calculateRunningTotal,
  formatCurrency,
  lineTotal,
  normalizeQuantity,
  parseQuantityInput,
  removeItem,
  resolveDisplayCurrency,
  setConfig,
  setQuantity,
} from "./equipItems";
import type { EquipDeviceItem } from "./equipTypes";

const item = (overrides: Partial<EquipDeviceItem>): EquipDeviceItem => ({
  lineId: "l-1",
  productId: "1",
  name: "MacBook Air",
  source: "MARKETPLACE",
  origin: "MANUAL",
  unitPrice: 100,
  currency: "USD",
  quantity: 1,
  config: "none",
  ...overrides,
});

describe("addItem", () => {
  it("appends a new line", () => {
    assert.equal(addItem([], item({})).length, 1);
  });

  it("ignores a duplicate lineId", () => {
    const items = [item({})];
    assert.equal(addItem(items, item({})).length, 1);
  });
});

describe("removeItem", () => {
  it("removes the matching line", () => {
    const items = [item({ lineId: "a" }), item({ lineId: "b" })];
    assert.deepEqual(
      removeItem(items, "a").map((i) => i.lineId),
      ["b"],
    );
  });
});

describe("setQuantity", () => {
  it("updates quantity and clamps to a minimum of 1", () => {
    const items = [item({ lineId: "a", quantity: 2 })];
    assert.equal(setQuantity(items, "a", 5)[0].quantity, 5);
    assert.equal(setQuantity(items, "a", 0)[0].quantity, 1);
    assert.equal(setQuantity(items, "a", -3)[0].quantity, 1);
  });
});

describe("parseQuantityInput", () => {
  it("parses bulk values and clamps invalid input", () => {
    assert.equal(parseQuantityInput("25", 1), 25);
    assert.equal(parseQuantityInput("  10  ", 1), 10);
    assert.equal(parseQuantityInput("", 4), 4);
    assert.equal(parseQuantityInput("abc", 4), 4);
    assert.equal(parseQuantityInput("0", 4), 1);
    assert.equal(parseQuantityInput("-5", 4), 1);
  });
});

describe("normalizeQuantity", () => {
  it("rounds and enforces a minimum of 1", () => {
    assert.equal(normalizeQuantity(12.8), 13);
    assert.equal(normalizeQuantity(0), 1);
  });
});

describe("setConfig", () => {
  it("updates only the matching line config", () => {
    const items = [item({ lineId: "a" }), item({ lineId: "b" })];
    const next = setConfig(items, "a", "MI");
    assert.equal(next[0].config, "MI");
    assert.equal(next[1].config, "none");
  });
});

describe("calculateRunningTotal", () => {
  it("sums priced lines and flags pending quotes", () => {
    const result = calculateRunningTotal([
      item({ lineId: "a", unitPrice: 100, quantity: 2 }),
      item({ lineId: "b", unitPrice: null, source: "RFQ" }),
    ]);
    assert.equal(result.total, 200);
    assert.equal(result.hasPending, true);
  });
});

describe("lineTotal", () => {
  it("returns null for pending items", () => {
    assert.equal(lineTotal(item({ unitPrice: null })), null);
    assert.equal(lineTotal(item({ unitPrice: 50, quantity: 3 })), 150);
  });
});

describe("formatCurrency", () => {
  it("formats without fraction digits", () => {
    assert.equal(formatCurrency(1420, "USD"), "$1,420");
  });
});

describe("resolveDisplayCurrency", () => {
  it("uses the billing currency when there is no priced line", () => {
    assert.equal(resolveDisplayCurrency([], "GBP"), "GBP");
    assert.equal(
      resolveDisplayCurrency([item({ unitPrice: 0, currency: "USD" })], "GBP"),
      "GBP",
    );
  });

  it("keeps the currency on a priced line", () => {
    assert.equal(
      resolveDisplayCurrency(
        [item({ unitPrice: 1500, currency: "EUR" })],
        "GBP",
      ),
      "EUR",
    );
  });
});
