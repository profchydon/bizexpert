import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildTransactionInvoiceViewModel } from "./transactionInvoiceViewModel";
import { ITransactionDetail } from "@/types/transactions";

const baseTransaction = {
  amount: 120,
  currency_symbol: "£",
  number_of_equipments: 1,
  items_details: [
    {
      name: "macbook_pro",
      quantity: 1,
      type: "onboarding",
      unit_price: 80,
      amount: 80,
    },
    {
      name: "onboarding_fee",
      quantity: 1,
      type: "Service Fee",
      unit_price: 20,
      amount: 20,
    },
  ],
  tax_breakdown: {
    device_tax: 16,
    service_tax: 4,
    tax_metadata: {
      device_tax_rate: 0.2,
      service_tax_rate: 0.2,
      device_tax_amount: 16,
      service_tax_amount: 4,
      tax_label_device: "VAT",
      tax_label_service: "VAT",
    },
  },
} as ITransactionDetail;

describe("buildTransactionInvoiceViewModel", () => {
  it("merges device and service tax into one VAT footer line", () => {
    const viewModel = buildTransactionInvoiceViewModel(baseTransaction);

    assert.equal(viewModel.totals.vatLabel, "VAT");
    assert.equal(viewModel.totals.vatTotal, 20);
    assert.equal(viewModel.totals.subtotal, 100);
    assert.equal(viewModel.totals.total, 120);
  });

  it("computes per-line VAT from stored rates", () => {
    const viewModel = buildTransactionInvoiceViewModel(baseTransaction);

    assert.equal(viewModel.lines[0]?.vatAmount, 16);
    assert.equal(viewModel.lines[0]?.vatRate, 0.2);
    assert.equal(viewModel.lines[1]?.vatAmount, 4);
    assert.equal(viewModel.lines[1]?.vatRate, 0.2);
    assert.equal(viewModel.vatColumnLabel, "VAT");
  });

  it("uses Tax as the VAT column label when device and service labels differ", () => {
    const viewModel = buildTransactionInvoiceViewModel({
      ...baseTransaction,
      tax_breakdown: {
        ...baseTransaction.tax_breakdown,
        tax_metadata: {
          ...baseTransaction.tax_breakdown!.tax_metadata!,
          tax_label_device: "Sales Tax",
          tax_label_service: "Service Tax",
        },
      },
    });

    assert.equal(viewModel.vatColumnLabel, "Tax");
  });

  it("includes payment gateway fee before the total when card checkout applies", () => {
    const viewModel = buildTransactionInvoiceViewModel({
      ...baseTransaction,
      amount: 166,
      gateway_fee: 46,
    });

    assert.equal(viewModel.totals.gatewayFee, 46);
    assert.equal(viewModel.totals.subtotal, 100);
    assert.equal(viewModel.totals.vatTotal, 20);
    assert.equal(viewModel.totals.total, 166);
  });

  it("attaches the associated-order country to device lines", () => {
    const viewModel = buildTransactionInvoiceViewModel({
      ...baseTransaction,
      multiple_order_details: [
        {
          order_id: "1",
          country_id: "gb",
          country_code: "GB",
          country_name: "United Kingdom",
          type: "onboarding",
        },
      ],
    });

    assert.equal(viewModel.lines[0]?.country, "United Kingdom");
    assert.equal(viewModel.lines[1]?.country, undefined);
  });

  it("shows zero VAT in the footer instead of hiding the row", () => {
    const viewModel = buildTransactionInvoiceViewModel({
      ...baseTransaction,
      tax_breakdown: {
        device_tax: 0,
        service_tax: 0,
        tax_metadata: {
          device_tax_rate: 0,
          service_tax_rate: 0,
          device_tax_amount: 0,
          service_tax_amount: 0,
          tax_label_device: "VAT",
          tax_label_service: "VAT",
        },
      },
    });

    assert.equal(viewModel.totals.vatTotal, 0);
    assert.equal(viewModel.totals.vatLabel, "VAT");
  });
});
