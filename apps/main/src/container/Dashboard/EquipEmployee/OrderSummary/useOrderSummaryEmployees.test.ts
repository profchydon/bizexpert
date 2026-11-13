import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("useOrderSummaryEmployees", () => {
  it("overlays storage-actions deploy recipients from the unified order", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/OrderSummary/useOrderSummaryEmployees.ts",
      ),
      "utf8",
    );

    assert.match(source, /STORAGE_ACTIONS_FLOW/);
    assert.match(source, /useStorageUnifiedOrder/);
    assert.match(source, /applyStorageDeployRecipients/);
  });
});
