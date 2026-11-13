import { test } from "node:test";
import assert from "node:assert";

test("isBizExpertApp reads NEXT_PUBLIC_PRODUCT", async () => {
  const prev = process.env.NEXT_PUBLIC_PRODUCT;
  process.env.NEXT_PUBLIC_PRODUCT = "bizexpert";
  const { isBizExpertApp } = await import("./product");
  assert.equal(isBizExpertApp(), true);
  process.env.NEXT_PUBLIC_PRODUCT = "rayda";
  assert.equal(isBizExpertApp(), false);
  process.env.NEXT_PUBLIC_PRODUCT = prev;
});
