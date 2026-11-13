import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveAssetTypeName } from "./resolveAssetTypeName";

const assetTypes = [
  { id: "type-laptop", name: "Laptop/Workstation" },
  { id: "type-phone", name: "Phones" },
];

describe("resolveAssetTypeName", () => {
  it("returns a named type unchanged", () => {
    assert.equal(resolveAssetTypeName("Phones", assetTypes), "Phones");
  });

  it("maps an asset-type id to its name", () => {
    assert.equal(
      resolveAssetTypeName("type-laptop", assetTypes),
      "Laptop/Workstation",
    );
  });

  it("returns undefined when no type is provided", () => {
    assert.equal(resolveAssetTypeName(undefined, assetTypes), undefined);
  });
});
