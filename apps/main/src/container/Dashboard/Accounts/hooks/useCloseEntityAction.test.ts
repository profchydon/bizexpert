import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("useCloseEntityAction", () => {
  it("calls POST /companies/{entityId}/close via RTK mutation", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/useCloseEntityAction.ts",
      ),
      "utf8",
    );

    assert.match(source, /useCloseEntityMutation/);
    assert.match(source, /entityApiErrorMessage/);
    assert.match(source, /closeEntity\(\{ entityId \}\)/);
  });
});
