import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const inventory = readFileSync(
  "src/container/Dashboard/Storage/Remote/hooks/useStorageInventoryApi.ts",
  "utf8",
);
const detail = readFileSync(
  "src/container/Dashboard/Storage/Remote/hooks/useStorageEquipmentDetail.ts",
  "utf8",
);
const review = readFileSync(
  "src/container/Dashboard/Storage/Remote/components/dispose/DisposeReviewStep.tsx",
  "utf8",
);
const confirm = readFileSync(
  "src/container/Dashboard/Storage/Remote/components/dispose/DisposeConfirmStep.tsx",
  "utf8",
);

describe("storage workspace currency", () => {
  it("inventory and equipment detail mappers receive the workspace currency", () => {
    assert.match(inventory, /useWorkspaceEquipmentDefaults/);
    assert.match(inventory, /mapInStorageInventoryItem\(item, currencyCode\)/);
    assert.match(detail, /useWorkspaceEquipmentDefaults/);
    assert.match(
      detail,
      /mapInStorageEquipmentDetail\(query\.data\.data, currencyCode\)/,
    );
  });

  it("dispose fee rows use the workspace currency symbol", () => {
    assert.match(review, /useWorkspaceCurrencySymbol/);
    assert.match(review, /formatFeePerDevice\(erasureFee, currencySymbol\)/);
    assert.match(confirm, /useWorkspaceCurrencySymbol/);
    assert.match(confirm, /formatFeePerDevice\(erasureFee, currencySymbol\)/);
    assert.doesNotMatch(review, /currencySymbol\(device\.currency\)/);
    assert.doesNotMatch(confirm, /currencySymbol\(device\.currency\)/);
  });
});
