import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("marketplace cart items", () => {
  it("passes tax-aware line totals into CartSlideoutItem", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/dashboard/NavBar/MarketplaceCartItems.tsx"),
      "utf8",
    );

    assert.match(source, /lineTotal=\{formatPrice\(unit \* item\.quantity\)\}/);
    assert.match(source, /unitPrice=\{formatPrice\(unit\)\}/);
    assert.match(source, /displayDeviceAmount/);
    assert.doesNotMatch(source, /currencySymbol=\{currencySymbol\}/);
  });
});
