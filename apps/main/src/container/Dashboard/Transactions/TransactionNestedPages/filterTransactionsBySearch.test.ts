import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filterTransactionsBySearch } from "./filterTransactionsBySearch";

describe("filterTransactionsBySearch", () => {
  it("returns all rows when search is empty", () => {
    const rows = [
      {
        reference: "TX-1",
        order_number: "ORD-1",
        method: "Card",
        payment: "Paid",
      },
    ];
    assert.deepEqual(filterTransactionsBySearch(rows, "  "), rows);
  });

  it("matches reference, order number, method, or payment", () => {
    const rows = [
      {
        reference: "TX-99",
        order_number: "ORD-1",
        method: "Card",
        payment: "Paid",
      },
      {
        reference: "TX-1",
        order_number: "ORD-88",
        method: "Wallet",
        payment: "Failed",
      },
    ];

    assert.equal(filterTransactionsBySearch(rows, "tx-99").length, 1);
    assert.equal(filterTransactionsBySearch(rows, "ord-88").length, 1);
    assert.equal(filterTransactionsBySearch(rows, "wallet").length, 1);
    assert.equal(filterTransactionsBySearch(rows, "failed").length, 1);
    assert.equal(filterTransactionsBySearch(rows, "missing").length, 0);
  });

  it("matches initiated by, status labels, and associated order types", () => {
    const rows = [
      {
        reference: "TX-1",
        initiated_by: "Lana Steiner",
        status: "Fulfilled",
        method: "Card",
        multiple_order_details: [
          {
            order_id: "1",
            order_number: "RE-BTS-GB02-2026",
            country_id: "gb",
            country_code: "GB",
            country_name: "United Kingdom",
            type: "buy_to_storage",
          },
        ],
      },
    ];

    assert.equal(filterTransactionsBySearch(rows, "lana").length, 1);
    assert.equal(filterTransactionsBySearch(rows, "paid").length, 1);
    assert.equal(filterTransactionsBySearch(rows, "buy_to_storage").length, 1);
    assert.equal(filterTransactionsBySearch(rows, "united kingdom").length, 1);
  });
});
