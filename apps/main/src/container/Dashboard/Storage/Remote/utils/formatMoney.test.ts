import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  cartCurrency,
  formatFeePerDevice,
  formatMoney,
  formatUsd,
} from "./storagePricing";

describe("formatMoney", () => {
  it("uses the cart line currency symbol, including ISO codes", () => {
    assert.equal(formatMoney(75, "£"), "£75.00");
    assert.equal(formatMoney(75, "GBP"), "£75.00");
    assert.equal(formatMoney(75), "$75.00");
    assert.equal(formatUsd(75), "$75.00");
  });

  it("picks the first cart line currency for section totals", () => {
    assert.equal(cartCurrency([{ currency: "£" }]), "£");
    assert.equal(cartCurrency([{ currency: "GBP" }]), "£");
    assert.equal(cartCurrency([{}]), "$");
  });

  it("formats a service fee with the workspace currency symbol", () => {
    assert.equal(formatFeePerDevice(75, "£"), "£75 per device");
    assert.equal(formatFeePerDevice(75, "GBP"), "£75 per device");
    assert.equal(formatFeePerDevice(75, "NGN"), "₦75 per device");
    assert.equal(formatFeePerDevice(75), "$75 per device");
  });
});
