import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ICart } from "@/types/cart";
import { canClearCartItems, canRemoveCartItem } from "./cartItemActions";

const cartItem = (source?: string | null) => ({ source }) as ICart;

describe("cart item actions", () => {
  it("allows clearing carts that contain RFQ items", () => {
    assert.equal(canClearCartItems([cartItem("rfq")]), true);
  });

  it("allows removing individual RFQ cart items", () => {
    assert.equal(canRemoveCartItem(cartItem("rfq")), true);
  });
});
