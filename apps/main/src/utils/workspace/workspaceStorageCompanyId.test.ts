import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const STORAGE_FILES = [
  "src/container/Dashboard/Storage/Remote/hooks/useStorageInventoryApi.ts",
  "src/container/Dashboard/Storage/Remote/hooks/useStorageOrdersApi.ts",
  "src/container/Dashboard/Storage/Remote/hooks/useStorageOrdersCounts.ts",
  "src/container/Dashboard/Storage/Remote/hooks/useStorageEquipmentDetail.ts",
];

describe("workspaceStorageCompanyId", () => {
  for (const filePath of STORAGE_FILES) {
    it(`${filePath} uses useWorkspaceCompanyId for API company ids`, () => {
      const source = readFileSync(filePath, "utf8");
      assert.match(source, /useWorkspaceCompanyId/);
      assert.match(source, /const companyId = useWorkspaceCompanyId\(\)/);
      assert.doesNotMatch(source, /getCompanyDetails\(\)\?\.id/);
    });
  }

  it("storage export auth resolves company id from the active workspace", () => {
    const source = readFileSync(
      "src/container/Dashboard/Storage/Remote/utils/getStorageExportAuth.ts",
      "utf8",
    );
    assert.match(source, /resolveWorkspaceApiCompanyId/);
    assert.match(source, /workspaceScope\.activeEntityId/);
    assert.match(source, /auth_token/);
  });
});
