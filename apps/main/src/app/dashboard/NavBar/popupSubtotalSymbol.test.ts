import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { popupSubtotalSymbol } from "./popupSubtotalSymbol.ts";

describe("popupSubtotalSymbol", () => {
  it("uses the storage action currency when the cart has no products", () => {
    assert.equal(
      popupSubtotalSymbol({
        actionCurrencies: ["GBP"],
        billingSymbol: "£",
      }),
      "£",
    );
  });

  it("uses the billing currency when a storage action has no currency", () => {
    assert.equal(
      popupSubtotalSymbol({
        actionCurrencies: [undefined],
        billingSymbol: "£",
      }),
      "£",
    );
  });

  it("keeps a product line currency", () => {
    assert.equal(
      popupSubtotalSymbol({
        productCurrency: "USD",
        actionCurrencies: ["GBP"],
        billingSymbol: "£",
      }),
      "$",
    );
  });
});
