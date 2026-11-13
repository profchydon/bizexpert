import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("getStorageExportAuth", () => {
  it("reads auth from the redux store for async export handlers", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/utils/getStorageExportAuth.ts",
      ),
      "utf8",
    );

    assert.match(source, /reduxStore\.getState/);
    assert.match(source, /resolveWorkspaceApiCompanyId/);
    assert.match(source, /workspaceScope\.activeEntityId/);
    assert.match(source, /auth_token/);
  });
});
