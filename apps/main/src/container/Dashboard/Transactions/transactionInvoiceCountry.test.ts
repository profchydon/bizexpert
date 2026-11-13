import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { countryForInvoiceLine } from "./transactionInvoiceCountry";

describe("countryForInvoiceLine", () => {
  it("uses the single associated-order country for device rows", () => {
    assert.equal(
      countryForInvoiceLine({
        isServiceFee: false,
        orders: [
          {
            order_id: "1",
            country_id: "us",
            country_code: "US",
            country_name: "United States",
          },
        ],
      }),
      "United States",
    );
  });

  it("skips service fees and mixed-country device rows", () => {
    assert.equal(
      countryForInvoiceLine({
        isServiceFee: true,
        orders: [
          {
            order_id: "1",
            country_id: "us",
            country_code: "US",
            country_name: "United States",
          },
        ],
      }),
      undefined,
    );
    assert.equal(
      countryForInvoiceLine({
        isServiceFee: false,
        orders: [
          {
            order_id: "1",
            country_id: "us",
            country_code: "US",
            country_name: "United States",
          },
          {
            order_id: "2",
            country_id: "gb",
            country_code: "GB",
            country_name: "United Kingdom",
          },
        ],
      }),
      undefined,
    );
  });
});
