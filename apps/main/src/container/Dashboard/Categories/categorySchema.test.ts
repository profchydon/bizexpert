import assert from "node:assert/strict";
import { test } from "node:test";
import { toCategoryPayload } from "./categorySchema";

test("toCategoryPayload sends parentId for sub-categories", () => {
  assert.deepEqual(
    toCategoryPayload({
      name: "Cola",
      parentId: "11111111-1111-1111-1111-111111111111",
    }),
    {
      name: "Cola",
      parentId: "11111111-1111-1111-1111-111111111111",
    },
  );
});

test("toCategoryPayload omits parentId for main categories", () => {
  assert.deepEqual(toCategoryPayload({ name: "Beverages", parentId: "" }), {
    name: "Beverages",
  });
});
