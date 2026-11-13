import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatTaxRatePercent,
  lineVatAmount,
  lineVatRate,
  vatColumnLabel,
} from "./lineVat";

describe("lineVat", () => {
  const metadata = {
    device_tax_rate: 0.2,
    service_tax_rate: 0.05,
    tax_label_device: "VAT",
    tax_label_service: "VAT",
  };

  it("applies device rate to device lines and service rate to service fee lines", () => {
    assert.equal(lineVatRate(false, metadata), 0.2);
    assert.equal(lineVatRate(true, metadata), 0.05);
    assert.equal(lineVatAmount(100, false, metadata), 20);
    assert.equal(lineVatAmount(100, true, metadata), 5);
  });

  it("uses a shared VAT column label when device and service labels match", () => {
    assert.equal(vatColumnLabel(metadata), "VAT");
  });

  it("falls back to Tax when labels differ", () => {
    assert.equal(
      vatColumnLabel({
        ...metadata,
        tax_label_device: "Sales Tax",
        tax_label_service: "Service Tax",
      }),
      "Tax",
    );
  });

  it("formats tax rates for display", () => {
    assert.equal(formatTaxRatePercent(0.2), "20%");
    assert.equal(formatTaxRatePercent(0.075), "7.5%");
  });
});
