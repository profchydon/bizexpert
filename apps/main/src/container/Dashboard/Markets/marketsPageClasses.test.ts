import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  marketCardClass,
  marketCardFooterClass,
  marketCardGridClass,
  marketCategoryClass,
  marketLogoClass,
} from "./marketsPageClasses";

test("integration cards use the settings-style bordered tile", () => {
  assert.equal(marketCardClass.includes("border border-gray-200"), true);
  assert.equal(marketCardGridClass.includes("xl:grid-cols-3"), true);
  assert.equal(marketLogoClass.includes("size-10"), true);
  assert.equal(marketCategoryClass.includes("rounded-full"), true);
  assert.equal(marketCardFooterClass.includes("border-t"), true);
});

test("integration cards render logo category and manage actions", () => {
  const cards = readFileSync(
    "src/container/Dashboard/Markets/MarketCards.tsx",
    "utf8",
  );
  assert.equal(cards.includes("ArrowUpRight"), true);
  assert.equal(cards.includes("Connected"), true);
  assert.equal(cards.includes("Manage"), true);
});
