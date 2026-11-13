import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  companyBillingCurrency,
  companyBillingCurrencySymbol,
} from "./companyBillingCurrency.ts";

describe("companyBillingCurrency", () => {
  it("prefers billing_currency over billing_currency_code", () => {
    assert.equal(
      companyBillingCurrency({
        billing_currency: "USD",
        billing_currency_code: "EUR",
      }),
      "USD",
    );
  });

  it("uses billing_currency_code when billing_currency is blank", () => {
    assert.equal(
      companyBillingCurrency({
        billing_currency: "  ",
        billing_currency_code: "GBP",
      }),
      "GBP",
    );
  });

  it("returns an empty code when both billing fields are missing", () => {
    assert.equal(companyBillingCurrency(null), "");
    assert.equal(companyBillingCurrency({}), "");
  });
});

describe("companyBillingCurrencySymbol", () => {
  it("turns the billing code into a symbol", () => {
    assert.equal(
      companyBillingCurrencySymbol({ billing_currency: "USD" }),
      "$",
    );
    assert.equal(
      companyBillingCurrencySymbol({ billing_currency_code: "GBP" }),
      "£",
    );
  });

  it("uses an empty symbol when the company has no billing currency", () => {
    assert.equal(companyBillingCurrencySymbol(undefined), "");
  });
});
