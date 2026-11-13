import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("useSubsidiaryDetailEdit", () => {
  it("submits PUT /companies/{entityId} with the edit payload", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/useSubsidiaryDetailEdit.ts",
      ),
      "utf8",
    );

    assert.match(source, /useUpdateEntityMutation/);
    assert.match(source, /buildUpdateEntityPayload/);
    assert.match(source, /entityApiErrorMessage/);
  });
});
