import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { TaxContext } from "@/hooks/useTaxContext";
import {
  cartInclAnnotation,
  cartSubtotalLabel,
  displayDeviceAmount,
  displayServiceAmount,
} from "./display";

const ctx = (overrides: Partial<TaxContext["config"]> = {}): TaxContext => ({
  mode: "inclusive",
  entityName: "Acme",
  isLoading: false,
  config: {
    code: "US",
    countryLabel: "United States",
    deviceLabel: "Sales Tax",
    serviceLabel: "Sales Tax",
    deviceRate: 0.08,
    serviceRate: 0.08,
    ...overrides,
  },
});

describe("cart tax display", () => {
  it("does not re-apply VAT on marketplace prices that already include it", () => {
    const nlVat = ctx({
      code: "NL",
      countryLabel: "Netherlands",
      deviceLabel: "VAT",
      serviceLabel: "VAT",
      deviceRate: 0.21,
      serviceRate: 0.21,
    });

    assert.equal(displayDeviceAmount(147.62, nlVat), 147.62);
    assert.notEqual(displayDeviceAmount(147.62, nlVat), 178.62);
  });

  it("leaves at-payment marketplace device amounts unchanged", () => {
    assert.equal(
      displayDeviceAmount(147.62, { ...ctx(), mode: "at-payment" }),
      147.62,
    );
  });

  it("grosses up storage service fees in inclusive mode", () => {
    assert.equal(displayServiceAmount(25, ctx()), 27);
  });

  it("uses the service tax label for storage-only carts", () => {
    assert.equal(
      cartInclAnnotation(ctx(), { hasProducts: false, hasActions: true }),
      "incl. Sales Tax",
    );
  });

  it("builds the cart subtotal label for storage-only carts", () => {
    assert.equal(
      cartSubtotalLabel(ctx(), { hasProducts: false, hasActions: true }),
      "Subtotal (incl. Sales Tax)",
    );
  });

  it("uses the device tax label when marketplace products are present", () => {
    assert.equal(
      cartInclAnnotation(ctx(), { hasProducts: true, hasActions: false }),
      "incl. Sales Tax",
    );
  });
});
