import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("storage index gate", () => {
  it("switches remote and legacy storage with the feature flag", () => {
    const source = readFileSync(
      join(process.cwd(), "src/container/Dashboard/Storage/index.tsx"),
      "utf8",
    );

    assert.match(source, /FEATURE_FLAGS\.REMOTE_STORAGE/);
    assert.match(source, /<StoragePage \/>/);
    assert.match(source, /<StorageLegacy \/>/);
    assert.doesNotMatch(source, /useGetInStorageEquipmentsQuery/);
    assert.doesNotMatch(source, /useWorkspaceCompanyId/);
  });
});
