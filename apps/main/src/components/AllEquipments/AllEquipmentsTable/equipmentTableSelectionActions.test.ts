import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("EquipmentTableSelectionActions", () => {
  it("uses legacy canPerformAction bulk rules and click-time conflict checks", () => {
    const source = readFileSync(
      join(__dirname, "EquipmentTableSelectionActions.tsx"),
      "utf8",
    );
    const buttonSource = readFileSync(
      join(__dirname, "equipmentTableSelectionActionButton.tsx"),
      "utf8",
    );

    assert.match(source, /canPerformAction/);
    assert.match(source, /canPerform\("transfer"\)/);
    assert.match(source, /isBulkActionEligible/);
    assert.match(source, /getBulkActionDisabledReason/);
    assert.match(source, /filterItemsByAction/);
    assert.doesNotMatch(source, /getBulkSelectionActionState/);
    assert.doesNotMatch(source, /equipmentLifecycleEligibility/);
    assert.match(buttonSource, /onPress={isDisabled \? undefined : onPress}/);
    assert.match(buttonSource, /isDisabled={isDisabled}/);
  });
});
