import assert from "node:assert/strict";
import { describe, it } from "node:test";

import formatAmount from "./formatAmount";

describe("formatAmount", () => {
  it("formats currency values with two decimal places", () => {
    assert.equal(formatAmount(95.4), "95.40");
    assert.equal(formatAmount("37.1"), "37.10");
    assert.equal(formatAmount(53), "53.00");
    assert.equal(formatAmount(9), "9.00");
    assert.equal(formatAmount(104.94), "104.94");
    assert.equal(formatAmount(299.44), "299.44");
  });

  it("returns 0.00 for invalid values", () => {
    assert.equal(formatAmount(""), "0.00");
    assert.equal(formatAmount("not-a-number"), "0.00");
  });
});
