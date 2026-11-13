import assert from "node:assert/strict";
import { test } from "node:test";
import { categorySelectOptions } from "./categorySelectOptions";

test("categorySelectOptions adds None and keeps an unmatched current value", () => {
  assert.deepEqual(categorySelectOptions([{ name: "Drinks" }], "Food"), [
    { value: "", label: "None" },
    { value: "Drinks", label: "Drinks" },
    { value: "Food", label: "Food" },
  ]);
  assert.deepEqual(categorySelectOptions([{ name: "Drinks" }], "drinks"), [
    { value: "", label: "None" },
    { value: "Drinks", label: "Drinks" },
  ]);
});
