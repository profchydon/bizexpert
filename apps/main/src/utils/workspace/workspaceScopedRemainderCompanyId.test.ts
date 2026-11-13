import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const REMAINDER_FILES = [
  "src/container/Dashboard/Overview/OverviewDashboardMap/GlobalPresenceMap/index.tsx",
  "src/container/Dashboard/Settings/EquipmentRefresh/index.tsx",
];

describe("workspaceScopedRemainderCompanyId", () => {
  for (const filePath of REMAINDER_FILES) {
    it(`${filePath} uses useWorkspaceCompanyId for API company ids`, () => {
      const source = readFileSync(filePath, "utf8");
      assert.match(source, /useWorkspaceCompanyId/);
      assert.match(source, /const companyId = useWorkspaceCompanyId\(\)/);
      assert.doesNotMatch(source, /companyId:\s*company\?\.id/);
      assert.doesNotMatch(source, /companyId:\s*company\.id/);
    });
  }
});
