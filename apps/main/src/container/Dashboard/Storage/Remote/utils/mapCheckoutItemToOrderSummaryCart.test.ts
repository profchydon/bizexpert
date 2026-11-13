import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CheckoutItem } from "../hooks/useStorageCheckout";
import { mapCheckoutItemToOrderSummaryCart } from "./mapCheckoutItemToOrderSummaryCart";

const disposalItem: CheckoutItem = {
  id: "line-1",
  kind: "disposal",
  deviceId: "eq-1",
  deviceName: "Apple MacBook Pro M2",
  serialNumber: "HKAJSH",
  country: "United States",
  assetType: "Laptop/Workstation",
  currency: "£",
};

describe("mapCheckoutItemToOrderSummaryCart", () => {
  it("forwards the cart line currency onto the order-summary item", () => {
    const cart = mapCheckoutItemToOrderSummaryCart(disposalItem);

    assert.equal(cart.pricing.currency_code, "£");
    assert.equal(cart.asset.asset_pricing.currency.symbol, "£");
  });

  it("forwards the deploy recipient onto the order-summary item", () => {
    const cart = mapCheckoutItemToOrderSummaryCart({
      id: "line-2",
      kind: "deployment",
      deviceId: "eq-2",
      deviceName: "MB-AIR-M4-7P2L8Q",
      serialNumber: "GFGHFHG",
      country: "United States",
      assetType: "Laptop/Workstation",
      currency: "£",
      recipientName: "Olu Wale",
      recipientCountry: "United States",
      employeeId: "emp-2",
    });

    assert.equal(cart.recipientName, "Olu Wale");
    assert.equal(cart.recipientCountry, "United States");
    assert.equal(cart.employeeId, "emp-2");
  });
});
