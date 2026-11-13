import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { equipItemToCart } from "./buildEquipCheckout";
import { item } from "./equipCheckout.fixtures";

describe("equipItemToCart", () => {
  it("maps an equip item to a cart line with pricing and device_setup", () => {
    const cart = equipItemToCart(item(), { id: "country-9" });

    assert.ok(cart);
    assert.equal(cart?.pricing.id, "pricing-1");
    assert.equal(cart?.pricing.country_id, "country-9");
    assert.equal(cart?.pricing.asset_specification_id, "assetspec-1");
    assert.equal(cart?.quantity, 2);
    assert.equal(cart?.amount, "3000");
    assert.equal(cart?.device_setup, "ABM");
    assert.equal(cart?.fulfillment_date, undefined);
    assert.deepEqual(cart?.specification.properties, [
      { name: "Ram", value: "16GB" },
    ]);
  });

  it("attaches the resolved country (code + name) to the cart line", () => {
    const cart = equipItemToCart(item(), {
      id: "uk-id",
      code: "GB",
      name: "United Kingdom",
    });

    assert.deepEqual(cart?.country, {
      id: "uk-id",
      code: "GB",
      name: "United Kingdom",
    });
    assert.equal(cart?.pricing.country_id, "uk-id");
  });

  it("omits device_setup when config is none", () => {
    const cart = equipItemToCart(item({ config: "none" }));
    assert.equal(cart?.device_setup, undefined);
  });

  it("returns null when the asset or pricing id is missing", () => {
    assert.equal(equipItemToCart(item({ asset: undefined })), null);
  });

  it("maps a storage item to a free cart line carrying the equipment id", () => {
    const cart = equipItemToCart(
      item({
        source: "STORAGE",
        asset: undefined,
        productId: "equip-9",
        config: "none",
        thumbnail: "https://assets.rayda.co/store.png",
        specs: "16GB · 512GB",
      }),
      { id: "country-9" },
    );

    assert.ok(cart);
    assert.equal(cart?.amount, "0");
    assert.equal(cart?.source, "STORAGE");
    assert.equal(cart?.storage, true);
    assert.equal(cart?.equipmentId, "equip-9");
    assert.equal(cart?.pricing.id, "equip-9");
    assert.equal(cart?.pricing.country_id, "country-9");
    assert.equal(cart?.device_setup, undefined);
    assert.equal(cart?.asset.name, "Apple MacBook Air M3");
    assert.equal(cart?.fulfillment_date, undefined);
  });

  it("keeps the fulfilment date on marketplace and storage lines", () => {
    const marketplace = equipItemToCart(item({ fulfilmentDate: "2026-10-23" }));
    const storage = equipItemToCart(
      item({
        source: "STORAGE",
        asset: undefined,
        productId: "equip-9",
        fulfilmentDate: "2026-10-23",
      }),
    );

    assert.equal(marketplace?.fulfillment_date, "2026-10-23");
    assert.equal(storage?.fulfillment_date, "2026-10-23");
  });
});
