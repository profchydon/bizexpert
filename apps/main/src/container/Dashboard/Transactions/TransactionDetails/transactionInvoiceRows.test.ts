import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildTransactionInvoiceDisplay,
  dedupeInvoiceLineItems,
  isInvoiceSummaryRow,
} from "./transactionInvoiceRows";

const platformFee = {
  name: "platform_fee",
  devices: 1,
  quantity: 1,
  type: "Service Fee",
  unit_price: 99,
  amount: 99,
};

describe("isInvoiceSummaryRow", () => {
  it("detects subtotal and tax summary rows", () => {
    assert.equal(isInvoiceSummaryRow("Device Subtotal"), true);
    assert.equal(isInvoiceSummaryRow("service_subtotal"), true);
    assert.equal(isInvoiceSummaryRow("Service Tax"), true);
    assert.equal(isInvoiceSummaryRow("Platform Fee"), false);
  });
});

describe("dedupeInvoiceLineItems", () => {
  it("removes repeated fee rows with the same amount", () => {
    const rows = dedupeInvoiceLineItems([
      platformFee,
      platformFee,
      platformFee,
      {
        name: "offboarding_fee",
        quantity: 1,
        type: "Service Fee",
        unit_price: 90,
        amount: 90,
      },
    ]);

    assert.equal(rows.length, 2);
  });
});

describe("buildTransactionInvoiceDisplay", () => {
  it("dedupes line items and derives the payment gateway fee from the total", () => {
    const display = buildTransactionInvoiceDisplay({
      id: "tx-1",
      reference: "tx_ref",
      amount: 299.44,
      currency_symbol: "£",
      number_of_equipments: 1,
      items_details: [
        {
          name: "BenQ Monitor",
          quantity: 1,
          type: "Off-boarding",
          unit_price: 0,
          amount: 0,
        },
        {
          name: "offboarding_fee",
          devices: 1,
          quantity: 1,
          type: "Service Fee",
          unit_price: 90,
          amount: 90,
        },
        {
          name: "storage_fee",
          devices: 1,
          quantity: 1,
          type: "Service Fee",
          unit_price: 35,
          amount: 35,
        },
        {
          name: "wipe_fee",
          devices: 1,
          quantity: 1,
          type: "Service Fee",
          unit_price: 50,
          amount: 50,
        },
        platformFee,
        platformFee,
        platformFee,
        {
          name: "Device Subtotal",
          quantity: 0,
          type: "Summary",
          unit_price: 0,
          amount: 0,
        },
        {
          name: "Service Subtotal",
          quantity: 0,
          type: "Summary",
          unit_price: 0,
          amount: 274,
        },
      ],
      tax_breakdown: {
        device_tax: 0,
        service_tax: 16.44,
        tax_metadata: {
          device_tax_rate: 0,
          service_tax_rate: 0.06,
          device_tax_amount: 0,
          service_tax_amount: 16.44,
          tax_label_device: null,
          tax_label_service: "Service Tax",
        },
      },
    } as any);

    assert.equal(display.lineItems.length, 5);
    assert.equal(display.serviceSubtotal, 274);
    assert.equal(display.serviceTax, 16.44);
    assert.equal(display.paymentGatewayFee, 9);
    assert.equal(display.total, 299.44);
    assert.equal(display.showTaxBreakdown, true);
  });
});
