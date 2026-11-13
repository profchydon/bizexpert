import { test } from "node:test";
import assert from "node:assert/strict";
import { mapAssetToMarketplaceProduct } from "./mapAssetToMarketplaceProduct";
import type { IAsset } from "@/types/assets";

const basePrice = {
  id: "pricing-1",
  amount: "100",
  currency: { code: "USD", name: "US Dollar", symbol: "$" },
};

const baseAsset: IAsset = {
  id: "asset-1",
  asset_id: "asset-1",
  asset_spec_id: "spec-1",
  name: "MacBook Pro",
  description: "<p>Great laptop</p>",
  year: "2023",
  type: "Laptop",
  make: "Apple",
  model: "MacBook Pro",
  category: "Laptops",
  assetCode: "MBP-14",
  status: "Available",
  spec: [{ name: "RAM", value: "16GB" }],
  country: "US",
  asset_pricing: basePrice,
  createdAt: "2023-01-01",
  updatedAt: "2023-01-01",
  images: ["https://example.com/image.png"],
};

test("mapAssetToMarketplaceProduct ignores a missing asset", () => {
  assert.equal(mapAssetToMarketplaceProduct(undefined), null);
});

test("mapAssetToMarketplaceProduct uses the first specification price when the asset has none", () => {
  const product = mapAssetToMarketplaceProduct({
    ...baseAsset,
    asset_spec_id: undefined as unknown as string,
    asset_pricing: undefined as unknown as IAsset["asset_pricing"],
    specifications: [
      {
        id: "spec-a",
        spec: [{ name: "RAM", value: "8GB" }],
        properties: [],
        asset_pricing: { ...basePrice, id: "pricing-spec" },
      },
    ],
  });

  assert.equal(product?.id, "spec-a");
  assert.equal(product?.price?.id, "pricing-spec");
});

test("mapAssetToMarketplaceProduct prefers asset_spec_id as the product id", () => {
  const product = mapAssetToMarketplaceProduct(baseAsset);
  assert.equal(product.id, "spec-1");
  assert.equal(product.specId, "spec-1");
});

test("mapAssetToMarketplaceProduct falls back to asset id when there's no spec id", () => {
  const product = mapAssetToMarketplaceProduct({
    ...baseAsset,
    asset_spec_id: undefined as unknown as string,
  });
  assert.equal(product.id, "asset-1");
});

test("mapAssetToMarketplaceProduct carries name/images/spec/price through", () => {
  const product = mapAssetToMarketplaceProduct(baseAsset);
  assert.equal(product.name, "MacBook Pro");
  assert.deepEqual(product.images, ["https://example.com/image.png"]);
  assert.deepEqual(product.spec, [{ name: "RAM", value: "16GB" }]);
  assert.deepEqual(product.price, basePrice);
});

test("mapAssetToMarketplaceProduct maps each specification's asset_pricing and favorite flag", () => {
  const product = mapAssetToMarketplaceProduct({
    ...baseAsset,
    specifications: [
      {
        id: "spec-a",
        spec: [{ name: "RAM", value: "32GB" }],
        properties: [],
        is_favourite: true,
        asset_pricing: { ...basePrice, id: "pricing-2", amount: "200" },
      },
    ],
  });

  assert.equal(product.specifications?.length, 1);
  assert.equal(product.specifications?.[0].id, "spec-a");
  assert.equal(product.specifications?.[0].isFavorited, true);
  assert.equal(product.specifications?.[0].price?.id, "pricing-2");
});

test("mapAssetToMarketplaceProduct maps specification images for per-spec galleries", () => {
  const product = mapAssetToMarketplaceProduct({
    ...baseAsset,
    specifications: [
      {
        id: "spec-a",
        spec: [{ name: "RAM", value: "32GB" }],
        properties: [],
        images: ["https://example.com/spec-a.png"],
        asset_pricing: basePrice,
      },
    ],
  });

  assert.deepEqual(product.specifications?.[0].images, [
    "https://example.com/spec-a.png",
  ]);
});
