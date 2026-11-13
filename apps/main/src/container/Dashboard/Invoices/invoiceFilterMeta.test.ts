import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  invoiceAirwallexId,
  invoiceBadgeLabel,
  invoiceDisplayNumber,
  invoiceDisplayStatus,
  invoiceFilterTabs,
  invoiceFilterToApiParam,
  invoiceOrderNumbers,
  invoiceViewUrl,
} from "./invoiceFilterMeta";

describe("invoiceFilterMeta", () => {
  it("uses All, Unpaid, and Paid tabs", () => {
    assert.deepEqual(
      invoiceFilterTabs.map((tab) => tab.label),
      ["All", "Unpaid", "Paid"],
    );
    assert.equal(invoiceFilterToApiParam("unpaid"), "unpaid");
    assert.equal(invoiceFilterToApiParam("paid"), "paid");
  });

  it("keeps invoice number and Airwallex id separate", () => {
    assert.equal(
      invoiceDisplayNumber({ number: "INV-1", id: "inv_1" }),
      "INV-1",
    );
    assert.equal(invoiceDisplayNumber({ id: "inv_1" }), "-");
    assert.equal(invoiceAirwallexId({ id: "int_nlk5" }), "int_nlk5");
    assert.equal(invoiceAirwallexId(null), "-");
  });

  it("opens the hosted invoice url and falls back to the pdf", () => {
    assert.equal(
      invoiceViewUrl({
        url: "https://invoice.example/pay",
        pdf_url: "https://invoice.example/pdf",
      }),
      "https://invoice.example/pay",
    );
    assert.equal(
      invoiceViewUrl({ pdf_url: "https://invoice.example/pdf" }),
      "https://invoice.example/pdf",
    );
    assert.equal(invoiceViewUrl(null), "");
  });

  it("collects unique order numbers from the transaction", () => {
    assert.deepEqual(
      invoiceOrderNumbers({
        order_number: "RD-1",
        multiple_order_details: [
          {
            order_id: "1",
            order_number: "RD-1",
            country_id: "gb",
            country_code: "GB",
            country_name: "United Kingdom",
          },
          {
            order_id: "2",
            order_number: "RD-2",
            country_id: "de",
            country_code: "DE",
            country_name: "Germany",
          },
        ],
      } as any),
      ["RD-1", "RD-2"],
    );
  });

  it("treats paid_at as paid and missing status as unpaid", () => {
    assert.equal(
      invoiceDisplayStatus({ status: "UNPAID", paid_at: "2026-10-28" }),
      "PAID",
    );
    assert.equal(invoiceDisplayStatus({ status: "OPEN" }), "OPEN");
    assert.equal(invoiceDisplayStatus(null), "UNPAID");
    assert.equal(invoiceBadgeLabel({ status: "UNPAID" }), "Unpaid");
    assert.equal(invoiceBadgeLabel({ paid_at: "2026-10-28" }), "Paid");
  });
});
