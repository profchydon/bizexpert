import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  cartItemTotalAmount,
  cartItemUnitAmount,
  hasRfqCartItems,
  isRfqCartItem,
} from "@/utils/cartItemSource";

const createCartItem = (source?: string | null) =>
  ({
    source,
    specification: {},
  }) as unknown as Parameters<typeof isRfqCartItem>[0];

const createCartItemWithSpecificationSource = (source?: string | null) =>
  ({
    specification: { source },
  }) as unknown as Parameters<typeof isRfqCartItem>[0];

const createPricedCartItem = ({
  amount,
  pricingAmount,
  quantity,
  source,
}: {
  amount: string | number;
  pricingAmount: string | number;
  quantity: number;
  source?: string | null;
}) =>
  ({
    amount,
    pricing: { amount: pricingAmount },
    quantity,
    source,
    specification: {},
  }) as unknown as Parameters<typeof isRfqCartItem>[0];

describe("cart item source helpers", () => {
  it("detects RFQ cart items from the cart source", () => {
    assert.equal(isRfqCartItem(createCartItem("rfq")), true);
    assert.equal(isRfqCartItem(createCartItem("marketplace")), false);
  });

  it("detects RFQ cart items from the specification source", () => {
    assert.equal(
      isRfqCartItem(createCartItemWithSpecificationSource("rfq")),
      true,
    );
  });

  it("detects RFQ cart items inside a cart list", () => {
    assert.equal(
      hasRfqCartItems([createCartItem("marketplace"), createCartItem("RFQ")]),
      true,
    );
  });

  it("uses pricing amount as the RFQ unit amount", () => {
    assert.equal(
      cartItemUnitAmount(
        createPricedCartItem({
          amount: 6000,
          pricingAmount: 3000,
          quantity: 2,
          source: "rfq",
        }),
      ),
      3000,
    );
  });

  it("uses top-level amount as the RFQ total amount", () => {
    assert.equal(
      cartItemTotalAmount(
        createPricedCartItem({
          amount: 6000,
          pricingAmount: 3000,
          quantity: 2,
          source: "rfq",
        }),
      ),
      6000,
    );
  });

  it("keeps marketplace totals based on unit amount and quantity", () => {
    assert.equal(
      cartItemTotalAmount(
        createPricedCartItem({
          amount: 3000,
          pricingAmount: 3000,
          quantity: 2,
          source: "marketplace",
        }),
      ),
      6000,
    );
  });
});
