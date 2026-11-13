import assert from "node:assert/strict";
import { test } from "node:test";
import { findMarketApp, MARKET_APPS, marketInitial } from "./marketCatalog";

test("MARKET_APPS lists Jumia Konga and Jiji", () => {
  assert.deepEqual(
    MARKET_APPS.map((app) => app.slug),
    ["jumia", "konga", "jiji"],
  );
  assert.deepEqual(
    MARKET_APPS.map((app) => app.category),
    ["Marketplace", "Marketplace", "Classifieds"],
  );
});

test("findMarketApp returns a catalog app or undefined", () => {
  assert.equal(findMarketApp("jumia")?.name, "Jumia");
  assert.equal(findMarketApp("unknown"), undefined);
});

test("marketInitial uses the first letter", () => {
  assert.equal(marketInitial("Jumia"), "J");
  assert.equal(marketInitial("konga"), "K");
});
