import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const source = readFileSync(
  "src/container/Dashboard/Orders/ViewOrder/v2/table/useOrderInfoTableV2.ts",
  "utf8",
);

describe("useOrderInfoTableV2", () => {
  it("types pending cancellation ids as Set<string>", () => {
    assert.match(source, /new Set<string>\(\)/);
  });
});
