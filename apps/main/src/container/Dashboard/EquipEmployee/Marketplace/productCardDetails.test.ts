import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const source = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/EquipEmployee/Marketplace/ProductCardDetails.tsx",
  ),
  "utf8",
);

describe("ProductCardDetails country badge", () => {
  it("passes a FlagTypes value and no className to BadgeWithFlag", () => {
    assert.match(source, /toBadgeFlag\(selectedCountryCode\)/);
    assert.match(source, /flag=\{countryFlag\}/);
    assert.doesNotMatch(source, /<BadgeWithFlag[^>]*className=/);
  });
});
