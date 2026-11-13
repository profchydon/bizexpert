import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const source = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/EquipEmployee/AssignmentFlow/useAssignmentState.ts",
  ),
  "utf8",
);

describe("useAssignmentState cart reset", () => {
  it("skips RESET_FROM_CART when the cart signature is unchanged", () => {
    assert.match(source, /getCartItemsSignature\(items\)/);
    assert.match(
      source,
      /if \(lastSignatureRef\.current === cartSignature\) \{\s*return;/,
    );
    assert.match(source, /dispatch\(\{ type: "RESET_FROM_CART", items \}\);/);
  });
});
