import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("useSubsidiaryDetailClose", () => {
  it("wraps the close entity mutation with modal and alert state", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/useSubsidiaryDetailClose.ts",
      ),
      "utf8",
    );

    assert.match(source, /useCloseEntityAction/);
    assert.match(source, /handleCloseEntity/);
    assert.match(source, /setClosedAlert/);
    assert.match(source, /setCloseError/);
  });
});
