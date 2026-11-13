import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildUpdateEntityPayload } from "./buildUpdateEntityPayload";

describe("buildUpdateEntityPayload", () => {
  it("sends name for non-primary entities", () => {
    assert.deepEqual(
      buildUpdateEntityPayload({
        name: "Intensa United Kingdom 3",
        isPrimary: false,
      }),
      {
        name: "Intensa United Kingdom 3",
      },
    );
  });

  it("omits fields for primary entities", () => {
    assert.deepEqual(
      buildUpdateEntityPayload({
        name: "Intensa",
        isPrimary: true,
      }),
      {},
    );
  });
});
