import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { currencySymbol } from "./currencySymbol";

describe("currencySymbol", () => {
  it("converts ISO codes to their symbol", () => {
    assert.equal(currencySymbol("GBP"), "£");
    assert.equal(currencySymbol("USD"), "$");
    assert.equal(currencySymbol("NGN"), "₦");
    assert.equal(currencySymbol("EUR"), "€");
  });

  it("is case and whitespace insensitive", () => {
    assert.equal(currencySymbol(" gbp "), "£");
  });

  it("passes through values that are already symbols (idempotent)", () => {
    assert.equal(currencySymbol("£"), "£");
    assert.equal(currencySymbol("₦"), "₦");
    assert.equal(currencySymbol("$"), "$");
  });

  it("falls back to the input for unknown/non-ISO codes", () => {
    assert.equal(currencySymbol("ZZZ"), "ZZZ");
  });

  it("returns an empty string for nullish input (never a '$' default)", () => {
    assert.equal(currencySymbol(null), "");
    assert.equal(currencySymbol(undefined), "");
    assert.equal(currencySymbol(""), "");
  });
});
