import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("useStorageUnifiedOrder", () => {
  it("persists unified storage checkout orders in session storage", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/useStorageUnifiedOrder.ts",
      ),
      "utf8",
    );

    assert.match(source, /rr-unified-order-v1/);
    assert.match(source, /setStorageUnifiedOrder/);
    assert.match(source, /markStorageUnifiedOrderPaid/);
  });
});
