import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  billingSortBy,
  billingHistoryEmpty,
  invoiceDownloadUrl,
  invoiceOnScreen,
  invoiceStatusLabel,
  invoiceStatusTooltip,
  parseBillingInvoiceList,
} from "./billingInvoices";

const liveEmpty = {
  success: true,
  message: "Records fetched successfully",
  data: {
    data: [],
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
  },
};

describe("billing invoices", () => {
  it("reads the live empty invoice page", () => {
    const list = parseBillingInvoiceList(liveEmpty);
    assert.equal(list.data.length, 0);
    assert.equal(list.total, 0);
    assert.equal(list.per_page, 15);
    assert.equal(list.current_page, 1);
    assert.equal(list.last_page, 1);
  });

  it("reads the documented invoice fields", () => {
    const list = parseBillingInvoiceList({
      data: {
        data: [
          {
            id: "inv-1",
            number: "SUB-2026-09",
            billed_on: "2026-09-01",
            plan: { id: "scale", name: "Scale", slug: "scale" },
            device_count: 28,
            devices: {
              company: {
                count: 26,
                rate: "11.00",
                rate_display: "$11/device/mo",
              },
              byod: {
                count: 2,
                rate: "5.50",
                rate_display: "$5.50/device/mo",
              },
            },
            provider: "stripe",
            external_id: null,
            status: "paid",
            currency: "USD",
            amount: "297.00",
            amount_display: "$297.00",
            paid_at: "2026-09-01T10:00:00.000000Z",
            period: { start: null, end: null },
            links: { view: "/api/v2/invoices/inv-1", download: null },
          },
        ],
        total: 1,
        per_page: 15,
        current_page: 1,
        last_page: 1,
      },
    });
    const row = list.data[0];
    assert.equal(row?.number, "SUB-2026-09");
    assert.equal(row?.plan?.name, "Scale");
    assert.equal(row?.device_count, 28);
    assert.equal(row?.devices?.byod.count, 2);
    assert.equal(row?.amount_display, "$297.00");
    assert.equal(row?.links.download, null);
    assert.equal(invoiceStatusLabel("open"), "Open");
  });

  it("closes when the selected invoice is cleared even if the detail is cached", () => {
    const cached = {
      id: "inv-1",
      number: "SUB-2026-09",
      status: "open",
    };
    assert.equal(invoiceOnScreen(null, cached), null);
    assert.equal(
      invoiceOnScreen({ ...cached, billed_on: "" } as never, null)?.number,
      "SUB-2026-09",
    );
  });

  it("keeps sort columns on the invoice list contract", () => {
    assert.equal(billingSortBy("amount"), "amount");
    assert.equal(billingSortBy("created_at"), "billed_on");
    assert.equal(
      invoiceDownloadUrl(
        "/api/v2/companies/1/subscription/invoices/2.pdf",
        "https://dev-remote-api.rayda.co/api/v2",
      ),
      "https://dev-remote-api.rayda.co/api/v2/companies/1/subscription/invoices/2.pdf",
    );
    assert.equal(invoiceDownloadUrl(null, "https://example.com"), null);
  });

  it("covers paid, open, void, and an empty search", () => {
    assert.equal(
      invoiceStatusTooltip("paid"),
      "Charged successfully to the card on file.",
    );
    assert.match(invoiceStatusTooltip("open"), /unpaid/);
    assert.match(invoiceStatusTooltip("void"), /voided/);
    assert.equal(
      billingHistoryEmpty({
        filtering: true,
        isFree: false,
        freePlanName: "Procure",
      }).clear,
      true,
    );
    assert.match(
      billingHistoryEmpty({
        filtering: false,
        isFree: true,
        freePlanName: "Procure",
      }).description,
      /Procure is free/,
    );
  });
});
