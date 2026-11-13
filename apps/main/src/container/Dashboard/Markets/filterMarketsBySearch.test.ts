import assert from "node:assert/strict";
import { test } from "node:test";
import { filterMarketsBySearch } from "./filterMarketsBySearch";
import { MARKET_APPS } from "./marketCatalog";

test("filterMarketsBySearch matches name tagline and audience", () => {
  assert.equal(filterMarketsBySearch(MARKET_APPS, "jumia").length, 1);
  assert.equal(filterMarketsBySearch(MARKET_APPS, "classifieds").length, 1);
  assert.equal(filterMarketsBySearch(MARKET_APPS, "marketplace").length, 2);
  assert.equal(filterMarketsBySearch(MARKET_APPS, "retail").length, 2);
  assert.equal(filterMarketsBySearch(MARKET_APPS, "").length, 3);
  assert.equal(filterMarketsBySearch(MARKET_APPS, "unknown-market").length, 0);
});
