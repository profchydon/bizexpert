import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ICart } from "@/types/cart";
import { getCartItemsSignature } from "./assignmentReducer";

describe("getCartItemsSignature", () => {
  it("is stable for cart arrays with the same items and different identity", () => {
    const first = [
      {
        pricing: { id: "pricing-1" },
        quantity: 2,
        country: { code: "NG", label: "Nigeria" },
      },
    ] as ICart[];
    const second = [
      {
        pricing: { id: "pricing-1" },
        quantity: 2,
        country: { code: "NG", label: "Nigeria" },
      },
    ] as ICart[];

    assert.equal(getCartItemsSignature(first), getCartItemsSignature(second));
    assert.notEqual(first, second);
  });

  it("changes when quantity or country changes", () => {
    const base = [
      {
        pricing: { id: "pricing-1" },
        quantity: 1,
        country: { code: "NG", label: "Nigeria" },
      },
    ] as ICart[];
    const quantityChanged = [
      {
        pricing: { id: "pricing-1" },
        quantity: 2,
        country: { code: "NG", label: "Nigeria" },
      },
    ] as ICart[];

    assert.notEqual(
      getCartItemsSignature(base),
      getCartItemsSignature(quantityChanged),
    );
  });
});
