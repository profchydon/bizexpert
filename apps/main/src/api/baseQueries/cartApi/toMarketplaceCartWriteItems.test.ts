import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toMarketplaceCartWriteItems } from "./toMarketplaceCartWriteItems";
import type { ICart } from "@/types/cart";

describe("toMarketplaceCartWriteItems", () => {
  it("writes marketplace lines without a type so they replace only marketplace items", () => {
    const items = toMarketplaceCartWriteItems([
      {
        pricing: { id: "price-1", amount: "10", asset_specification_id: "s1" },
        quantity: 2,
      } as ICart,
    ]);

    assert.deepEqual(items, [{ asset_pricing_id: "price-1", quantity: 2 }]);
    assert.equal("type" in items[0]!, false);
  });
});
