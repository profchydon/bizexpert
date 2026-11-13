import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildFeeRows, type FeeSummaryLike } from "./feeSummary";

// Mirrors a taxed onboarding fee summary: 20% VAT on a 1,000 device subtotal and on 275 of fees.
const taxedSummary: FeeSummaryLike = {
  total_fee: 1530,
  total_purchase_price: 1000,
  total_onboarding_fee: 200,
  storage_fee: 0,
  insurance_fee: 75,
  platform_fee: 0,
  payment_gateway_fee: 0,
  currency: { symbol: "$", code: "USD" },
  device_tax: 200,
  service_tax: 55,
  tax_metadata: {
    device_tax_rate: 0.2,
    service_tax_rate: 0.2,
    device_tax_amount: 200,
    service_tax_amount: 55,
    tax_label_device: "VAT",
    tax_label_service: "VAT",
  },
  signature_requested: true,
  savings: {
    amount: 40,
    currency: "USD",
    is_subscribed: false,
    basis: "entry_paid_plan",
  },
};

const sum = (rows: { value: number }[]) =>
  Math.round(rows.reduce((total, row) => total + row.value, 0) * 100) / 100;

describe("buildFeeRows", () => {
  it("keeps lines net and adds one labelled tax row on tax-at-payment display", () => {
    assert.deepEqual(buildFeeRows(taxedSummary, "at-payment"), [
      {
        key: "total_purchase_price",
        name: "Total Purchase Price",
        value: 1000,
      },
      { key: "total_onboarding_fee", name: "Total Onboarding Fee", value: 200 },
      { key: "insurance_fee", name: "Insurance Fee", value: 75 },
      { key: "tax", name: "VAT", value: 255 },
    ]);
  });

  it("folds tax into the lines it was charged on for tax-inclusive display", () => {
    assert.deepEqual(buildFeeRows(taxedSummary, "inclusive"), [
      {
        key: "total_purchase_price",
        name: "Total Purchase Price",
        value: 1200,
      },
      { key: "total_onboarding_fee", name: "Total Onboarding Fee", value: 240 },
      { key: "insurance_fee", name: "Insurance Fee", value: 90 },
    ]);
  });

  it("sums to the charged total in both display modes", () => {
    const total = (taxedSummary.total_fee as number) ?? 0;

    assert.equal(sum(buildFeeRows(taxedSummary, "inclusive")), total);
    assert.equal(sum(buildFeeRows(taxedSummary, "at-payment")), total);
  });

  it("settles allocation rounding so folded service rows still sum to the tax charged", () => {
    const rows = buildFeeRows(
      {
        total_purchase_price: 0,
        total_onboarding_fee: 33.33,
        storage_fee: 33.33,
        insurance_fee: 33.34,
        service_tax: 5,
        tax_metadata: {
          device_tax_rate: 0.05,
          service_tax_rate: 0.05,
          device_tax_amount: 0,
          service_tax_amount: 5,
          tax_label_device: "GST",
          tax_label_service: "GST",
        },
      },
      "inclusive",
    );

    assert.equal(sum(rows), 105);
  });

  it("shows tax the lines cannot absorb rather than dropping it", () => {
    const rows = buildFeeRows(
      {
        total_purchase_price: 0,
        total_onboarding_fee: 0,
        service_tax: 12,
        tax_metadata: {
          device_tax_rate: 0.2,
          service_tax_rate: 0.2,
          device_tax_amount: 0,
          service_tax_amount: 12,
          tax_label_device: "VAT",
          tax_label_service: "VAT",
        },
      },
      "inclusive",
    );

    assert.deepEqual(rows, [{ key: "tax", name: "VAT", value: 12 }]);
  });

  it("labels residual tax correctly when neither line can absorb it", () => {
    const rows = buildFeeRows(
      {
        total_onboarding_fee: 0,
        device_tax: 75,
        service_tax: 5,
        tax_metadata: {
          device_tax_rate: 0.075,
          service_tax_rate: 0.05,
          device_tax_amount: 75,
          service_tax_amount: 5,
          tax_label_device: "Sales Tax",
          tax_label_service: "Service Tax",
        },
      },
      "inclusive",
    );

    assert.deepEqual(rows, [{ key: "tax", name: "Tax", value: 80 }]);
  });

  it("merges device and service tax into one VAT row at payment", () => {
    const rows = buildFeeRows(
      {
        total_purchase_price: 1000,
        total_onboarding_fee: 100,
        device_tax: 75,
        service_tax: 5,
        tax_metadata: {
          device_tax_rate: 0.075,
          service_tax_rate: 0.05,
          device_tax_amount: 75,
          service_tax_amount: 5,
          tax_label_device: "Sales Tax",
          tax_label_service: "Service Tax",
        },
      },
      "at-payment",
    );

    assert.deepEqual(rows.slice(2), [{ key: "tax", name: "Tax", value: 80 }]);
  });

  it("uses jurisdiction labels for a single combined VAT row when metadata labels differ", () => {
    const rows = buildFeeRows(
      {
        total_purchase_price: 1000,
        device_tax: 200,
        service_tax: 20,
        tax_metadata: {
          device_tax_rate: 0.2,
          service_tax_rate: 0.2,
          device_tax_amount: 200,
          service_tax_amount: 20,
          tax_label_device: "VAT",
          tax_label_service: "Service Tax",
        },
      },
      "at-payment",
      { deviceLabel: "VAT", serviceLabel: "VAT" },
    );

    assert.deepEqual(rows.at(-1), { key: "tax", name: "VAT", value: 220 });
  });

  it("omits zero tax rows even when the jurisdiction has configured rates", () => {
    const rows = buildFeeRows(
      {
        total_purchase_price: 1830,
        total_onboarding_fee: 90,
        device_tax: 0,
        service_tax: 2.81,
        tax_metadata: {
          device_tax_rate: 0.01,
          service_tax_rate: 0.01,
          device_tax_amount: 0,
          service_tax_amount: 2.81,
          tax_label_device: "Sales Tax",
          tax_label_service: "Service Tax",
        },
      },
      "at-payment",
    );

    assert.deepEqual(rows.slice(-1), [
      { key: "tax", name: "Tax", value: 2.81 },
    ]);
    assert.ok(
      !rows.some((row) => row.name.includes("devices")),
      "zero device tax row should be hidden",
    );
  });

  it("omits zero-value fee and tax rows from the checkout breakdown", () => {
    const rows = buildFeeRows(
      {
        total_purchase_price: 0.01,
        device_tax: 0,
        service_tax: 0,
        tax_metadata: {
          device_tax_rate: 0.2,
          service_tax_rate: 0.2,
          device_tax_amount: 0,
          service_tax_amount: 0,
          tax_label_device: "VAT",
          tax_label_service: "VAT",
        },
      },
      "at-payment",
    );

    assert.deepEqual(rows, [
      {
        key: "total_purchase_price",
        name: "Total Purchase Price",
        value: 0.01,
      },
    ]);
  });

  it("emits no tax row for an untaxed jurisdiction and drops non-money keys", () => {
    assert.deepEqual(
      buildFeeRows(
        {
          total_fee: 1000,
          total_purchase_price: 1000,
          storage_fee: 0,
          device_tax: 0,
          service_tax: 0,
          tax_metadata: null,
          currency: { symbol: "$", code: "USD" },
          signature_requested: false,
        },
        "inclusive",
      ),
      [
        {
          key: "total_purchase_price",
          name: "Total Purchase Price",
          value: 1000,
        },
      ],
    );
  });

  it("reads the gateway fee last, after the tax it was charged on", () => {
    const rows = buildFeeRows(
      { ...taxedSummary, payment_gateway_fee: 46 },
      "at-payment",
    );

    assert.deepEqual(rows.at(-1), {
      key: "payment_gateway_fee",
      name: "Payment Gateway Fee",
      value: 46,
    });
  });

  it("returns nothing without a summary", () => {
    assert.deepEqual(buildFeeRows(undefined, "inclusive"), []);
  });

  it("does not render subscriber savings as a fee row", () => {
    const rows = buildFeeRows(taxedSummary, "at-payment");
    assert.equal(
      rows.some((row) => row.key === "savings"),
      false,
    );
  });
});
