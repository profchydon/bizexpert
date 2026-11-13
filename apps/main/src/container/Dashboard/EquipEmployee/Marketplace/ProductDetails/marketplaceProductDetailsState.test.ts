import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isMarketplaceProductDetailsPending,
  marketplaceAssetCountryId,
  marketplaceDisplayCountry,
  marketplacePricingId,
  resolveMarketplaceSpecification,
  specificationSummary,
} from "./marketplaceProductDetailsState";

test("marketplace asset request uses the selected country", () => {
  assert.equal(marketplaceAssetCountryId("selected", "company"), "selected");
});

test("marketplace asset request falls back to the company country", () => {
  assert.equal(marketplaceAssetCountryId(undefined, "company"), "company");
});

test("display country keeps a selected marketplace country", () => {
  assert.deepEqual(
    marketplaceDisplayCountry(
      { id: "selected", name: "Nigeria", code: "NG" },
      { id: "company", name: "Netherlands", code: "NL" },
    ),
    { id: "selected", name: "Nigeria", code: "NG" },
  );
});

test("display country uses the company country when none is selected", () => {
  assert.deepEqual(
    marketplaceDisplayCountry(undefined, {
      id: "company",
      name: "Netherlands",
      code: "NL",
    }),
    { id: "company", name: "Netherlands", code: "NL" },
  );
});

test("product details stay pending until the asset arrives", () => {
  assert.equal(
    isMarketplaceProductDetailsPending({ hasAsset: false, isError: false }),
    true,
  );
  assert.equal(
    isMarketplaceProductDetailsPending({ hasAsset: true, isError: false }),
    false,
  );
});

test("a failed asset request is not left pending", () => {
  assert.equal(
    isMarketplaceProductDetailsPending({ hasAsset: false, isError: true }),
    false,
  );
});

test("an unknown spec id uses the first specification returned", () => {
  const selected = resolveMarketplaceSpecification(
    [
      { id: "spec-a", spec: [{ value: "8GB" }] },
      { id: "spec-b", spec: [{ value: "16GB" }] },
    ],
    "missing-spec",
  );

  assert.equal(selected?.id, "spec-a");
  assert.equal(specificationSummary(selected), "8GB");
});

test("pricing uses the selected specification when the asset has no price", () => {
  assert.equal(
    marketplacePricingId(
      { id: "spec-a", asset_pricing: { id: "pricing-a" } },
      undefined,
    ),
    "pricing-a",
  );
});
