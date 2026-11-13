import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatMoney } from "./utilsFormat.ts";

describe("catalog policy formatMoney", () => {
  it("formats a kit total in the billing currency", () => {
    assert.equal(formatMoney(1200, "GBP"), "£1,200");
  });

  it("leaves the symbol off when no currency is passed", () => {
    assert.equal(formatMoney(1200), "1,200");
    assert.equal(formatMoney(1200, "USD"), "$1,200");
  });
});
