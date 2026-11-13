import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isolateCartItems } from "./isolateCartItems";

describe("isolateCartItems", () => {
  it("hides marketplace products on storage and storage actions on marketplace", () => {
    const products = [{ id: "p1" }];
    const actions = [{ id: "a1" }];

    assert.deepEqual(isolateCartItems("storage", products, actions), {
      products: [],
      actions,
    });
    assert.deepEqual(isolateCartItems("marketplace", products, actions), {
      products,
      actions: [],
    });
  });

  it("does not mix leftover storage actions into a marketplace cart on other pages", () => {
    const products = [{ id: "p1" }];
    const actions = [{ id: "a1" }];

    assert.deepEqual(isolateCartItems("other", products, actions), {
      products,
      actions: [],
    });
    assert.deepEqual(isolateCartItems("other", [], actions), {
      products: [],
      actions,
    });
  });
});
