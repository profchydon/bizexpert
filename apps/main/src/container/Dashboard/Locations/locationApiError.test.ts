import assert from "node:assert/strict";
import { test } from "node:test";
import { readLocationApiError } from "./locationApiError";

test("readLocationApiError reads API message", () => {
  assert.equal(
    readLocationApiError({ response: { data: { message: "Taken" } } }),
    "Taken",
  );
});

test("readLocationApiError uses fallback", () => {
  assert.equal(readLocationApiError(null, "Failed"), "Failed");
});
