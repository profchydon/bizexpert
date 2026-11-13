import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IAsset } from "@/types/assets";
import { assetToEquipItem } from "./assetToEquipItem";

const baseAsset = (overrides: Partial<IAsset> = {}): IAsset =>
  ({
    id: "spec-1",
    asset_id: "asset-1",
    name: "Apple MacBook Air M2",
    category: "Macbook",
    spec: [
      { name: "Processor", value: "M2 Chip" },
      { name: "Ram", value: "16GB" },
      { name: "Display", value: "13.6-inch" },
      { name: "Storage", value: "256GB SSD" },
      { name: "Condition", value: "Brand New" },
    ],
    images: [
      "https://assets.rayda.co/one.png",
      "https://assets.rayda.co/two.png",
    ],
    asset_pricing: {
      id: "price-1",
      amount: "2000",
      currency: { code: "GBP", name: "British Pound Sterling", symbol: "£" },
    },
    ...overrides,
  }) as unknown as IAsset;

describe("assetToEquipItem", () => {
  it("maps a marketplace asset into an equip line item", () => {
    const item = assetToEquipItem(baseAsset());

    assert.equal(item.lineId, "spec-1");
    assert.equal(item.productId, "asset-1");
    assert.equal(item.name, "Apple MacBook Air M2");
    assert.equal(item.category, "Macbook");
    assert.equal(item.source, "MARKETPLACE");
    assert.equal(item.origin, "MANUAL");
    assert.equal(item.unitPrice, 2000);
    assert.equal(item.currency, "GBP");
    assert.equal(item.quantity, 1);
    assert.equal(item.thumbnail, "https://assets.rayda.co/one.png");
    assert.equal(item.config, "ABM");
  });

  it("drops condition specs and keeps at most three values", () => {
    const item = assetToEquipItem(baseAsset());
    assert.equal(item.specs, "M2 Chip · 16GB · 13.6-inch");
  });

  it("returns null price and default currency for invalid pricing", () => {
    const item = assetToEquipItem(
      baseAsset({
        asset_pricing: undefined as unknown as IAsset["asset_pricing"],
      }),
    );
    assert.equal(item.unitPrice, null);
    assert.equal(item.currency, "USD");
  });

  it("falls back to the spec id when asset_id is missing", () => {
    const item = assetToEquipItem(
      baseAsset({ asset_id: undefined as unknown as string }),
    );
    assert.equal(item.productId, "spec-1");
  });
});
