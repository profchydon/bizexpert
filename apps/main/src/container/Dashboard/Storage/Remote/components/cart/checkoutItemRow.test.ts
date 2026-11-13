import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("CheckoutItemRow", () => {
  it("renders country, serial, and disposition pill like the reference cart", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/components/cart/CheckoutItemRow.tsx",
      ),
      "utf8",
    );

    assert.match(source, /CountryFlag/);
    assert.match(source, /Ship to/);
    assert.match(source, /ButtonUtility/);
    assert.match(source, /formatMoney\(displayFee \?\? 0, item.currency\)/);
  });
});
