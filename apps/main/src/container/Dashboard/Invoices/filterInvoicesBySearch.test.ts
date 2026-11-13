import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filterInvoicesBySearch } from "./filterInvoicesBySearch";

describe("filterInvoicesBySearch", () => {
  it("matches invoice number and unpaid label", () => {
    const rows = [
      {
        id: "1",
        reference: "TX-1",
        invoice: { number: "INV-88", status: "UNPAID" },
        method: "Credit",
        payment: "Paid",
      },
      {
        id: "2",
        reference: "TX-2",
        invoice: { number: "INV-99", status: "PAID", paid_at: "2026-10-01" },
        method: "Card",
        payment: "Paid",
      },
    ];

    assert.equal(filterInvoicesBySearch(rows, "inv-88").length, 1);
    assert.equal(filterInvoicesBySearch(rows, "unpaid").length, 1);
    assert.equal(filterInvoicesBySearch(rows, "tx-2").length, 1);
    assert.equal(filterInvoicesBySearch(rows, "missing").length, 0);
  });
});
