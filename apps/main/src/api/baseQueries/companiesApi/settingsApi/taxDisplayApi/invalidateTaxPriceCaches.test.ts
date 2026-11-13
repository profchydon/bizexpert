import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  TAX_DISPLAY_COMPANY_TAGS,
  TAX_PRICE_CACHE_SLICE_KEYS,
  TAX_PRICE_CACHE_TAGS_BY_SLICE,
} from "./taxPriceCacheTags";

describe("taxPriceCacheTags", () => {
  it("names every RTK slice that caches tax-sensitive prices", () => {
    assert.deepEqual(TAX_DISPLAY_COMPANY_TAGS, ["TaxDisplay", "Catalogs"]);
    assert.deepEqual(TAX_PRICE_CACHE_SLICE_KEYS, [
      "companiesApi",
      "assetsApi",
      "cartApi",
      "feesApi",
    ]);
    assert.deepEqual(TAX_PRICE_CACHE_TAGS_BY_SLICE.assetsApi, ["Assets"]);
    assert.deepEqual(TAX_PRICE_CACHE_TAGS_BY_SLICE.cartApi, ["Cart"]);
    assert.deepEqual(TAX_PRICE_CACHE_TAGS_BY_SLICE.feesApi, ["Fees"]);
  });
});
