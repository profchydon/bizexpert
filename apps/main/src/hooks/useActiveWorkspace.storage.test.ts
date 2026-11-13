import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("useActiveWorkspace storage sync", () => {
  it("reads session storage synchronously and persists resolved workspace scope", () => {
    const source = readFileSync("src/hooks/useActiveWorkspace.ts", "utf8");

    assert.match(
      source,
      /useState<string \| null>\(\(\) =>\s*readStoredWorkspaceScope\(\)/,
    );
    assert.match(source, /writeStoredWorkspaceScope\(activeScopeId\)/);
  });
});

describe("useWorkspaceDashboardQueries", () => {
  it("resolves workspace company ids from the active entity", () => {
    const source = readFileSync(
      "src/hooks/useWorkspaceDashboardQueries.ts",
      "utf8",
    );

    assert.match(source, /useWorkspaceScopedCompanyArgs/);
    assert.doesNotMatch(source, /subsidiaryId/);
  });
});
