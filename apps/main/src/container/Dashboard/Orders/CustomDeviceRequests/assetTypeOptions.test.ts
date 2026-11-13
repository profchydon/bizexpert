import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildAssetTypeOptions } from "./assetTypeOptions";

const assetTypeNames = new Map<string, string>([
  ["9e3024c8-337e-445c-b0bd-728ddbc75c09", "Laptop/Workstation"],
  ["9e3024c8-3d7d-44cc-9569-2fc4d1ee41c6", "Accessories"],
]);

describe("buildAssetTypeOptions", () => {
  it("resolves asset-type ids to readable labels", () => {
    const options = buildAssetTypeOptions(
      ["9e3024c8-3d7d-44cc-9569-2fc4d1ee41c6"],
      assetTypeNames,
    );

    assert.deepEqual(options, [
      { label: "Accessories", value: "9e3024c8-3d7d-44cc-9569-2fc4d1ee41c6" },
    ]);
  });

  it("keeps readable names that are already resolved", () => {
    const options = buildAssetTypeOptions(["Phones"], assetTypeNames);
    assert.deepEqual(options, [{ label: "Phones", value: "Phones" }]);
  });

  it("merges a name and its id into one chip, preserving both values", () => {
    const options = buildAssetTypeOptions(
      ["Accessories", "9e3024c8-3d7d-44cc-9569-2fc4d1ee41c6"],
      assetTypeNames,
    );

    assert.equal(options.length, 1);
    assert.equal(options[0].label, "Accessories");
    assert.equal(
      options[0].value,
      "Accessories,9e3024c8-3d7d-44cc-9569-2fc4d1ee41c6",
    );
  });

  it("never surfaces an unmatched id when a sibling name exists", () => {
    const options = buildAssetTypeOptions(
      ["Laptop/Workstation", "9e3024c8-337e-445c-b0bd-728ddbc75c09"],
      assetTypeNames,
    );

    assert.equal(options.length, 1);
    assert.equal(options[0].label, "Laptop/Workstation");
  });

  it("sorts options alphabetically by label and ignores blanks", () => {
    const options = buildAssetTypeOptions(
      ["Phones", "  ", "Accessories"],
      assetTypeNames,
    );

    assert.deepEqual(
      options.map((option) => option.label),
      ["Accessories", "Phones"],
    );
  });

  it("falls back to the raw id when no name mapping exists", () => {
    const options = buildAssetTypeOptions(["unknown-id-123"], new Map());
    assert.deepEqual(options, [
      { label: "unknown-id-123", value: "unknown-id-123" },
    ]);
  });
});
