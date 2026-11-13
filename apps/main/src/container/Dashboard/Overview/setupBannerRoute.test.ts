import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const source = readFileSync(
  "src/container/Dashboard/Overview/SetupBanner.tsx",
  "utf8",
);

describe("setupBannerRoute", () => {
  it("routes Set up now to Asset Vault", () => {
    assert.match(source, /push\(routes\.ASSET_VAULT\)/);
    assert.doesNotMatch(source, /IMPORT_EQUIPMENT_STORAGE/);
  });
});
