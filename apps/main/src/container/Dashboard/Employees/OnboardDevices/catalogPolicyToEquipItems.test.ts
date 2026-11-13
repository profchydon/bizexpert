import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IEmployeeCatalogPolicy } from "@/types/employees";
import type { IKitItem } from "@/types/kit";
import {
  catalogPoliciesToEquipItems,
  catalogSpecToAsset,
  policyItemToEquipItem,
} from "./catalogPolicyToEquipItems";

const kitItem = (overrides: Partial<IKitItem> = {}): IKitItem =>
  ({
    id: "kit-item-1",
    asset_specification_id: "spec-1",
    required: true,
    quantity: 1,
    sort_order: 1,
    asset_specification: {
      id: "spec-1",
      asset_spec_id: "spec-1",
      asset_id: "asset-1",
      name: "Apple Macbook Pro M3",
      category: "Macbook",
      images: ["https://assets.rayda.co/one.png"],
      spec: { condition: "New", RAM: "16GB" },
      asset_pricing: {
        id: "pricing-1",
        amount: 2000,
        currency: { code: "GBP", name: "Pound", symbol: "£" },
      },
    },
    created_at: "",
    updated_at: "",
    ...overrides,
  }) as unknown as IKitItem;

describe("catalogSpecToAsset", () => {
  it("converts the spec object into a name/value array and stringifies amount", () => {
    const asset = catalogSpecToAsset({
      id: "spec-1",
      asset_spec_id: "spec-1",
      asset_id: "asset-1",
      name: "Dell XPS",
      spec: { RAM: "16GB", storage: "512GB" },
      asset_pricing: { id: "p1", amount: 1500, currency: { code: "USD" } },
    });

    assert.equal(asset.asset_pricing.amount, "1500");
    assert.equal(asset.asset_pricing.id, "p1");
    assert.deepEqual(asset.spec, [
      { name: "RAM", value: "16GB" },
      { name: "storage", value: "512GB" },
    ]);
  });
});

describe("policyItemToEquipItem", () => {
  it("maps a kit item to a FROM_POLICY equip item with a suggested config", () => {
    const item = policyItemToEquipItem(kitItem({ quantity: 2 }));

    assert.ok(item);
    assert.equal(item?.origin, "FROM_POLICY");
    assert.equal(item?.quantity, 2);
    assert.equal(item?.unitPrice, 2000);
    assert.equal(item?.currency, "GBP");
    assert.equal(item?.config, "ABM");
    assert.equal(item?.asset?.asset_pricing.id, "pricing-1");
  });

  it("returns null when the pricing id or asset spec is missing", () => {
    assert.equal(
      policyItemToEquipItem(kitItem({ asset_specification: null })),
      null,
    );
    assert.equal(
      policyItemToEquipItem(
        kitItem({
          asset_specification: { id: "x", name: "No price" } as never,
        }),
      ),
      null,
    );
  });
});

describe("catalogPoliciesToEquipItems", () => {
  const policy = (items: IKitItem[]): IEmployeeCatalogPolicy =>
    ({
      id: "policy-1",
      name: "Eng Policy",
      kits: { data: [{ id: "kit-1", items: { data: items } }] },
    }) as unknown as IEmployeeCatalogPolicy;

  it("flattens kit items across policies and de-duplicates by line id", () => {
    const items = catalogPoliciesToEquipItems([
      policy([kitItem(), kitItem({ id: "kit-item-2" })]),
    ]);

    assert.equal(items.length, 1);
    assert.equal(items[0].origin, "FROM_POLICY");
  });

  it("returns an empty array when there are no policies", () => {
    assert.deepEqual(catalogPoliciesToEquipItems(undefined), []);
  });
});
