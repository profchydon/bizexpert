import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("Apple Business Manager setup label", () => {
  it("displays ABM ID instead of ABM_ID", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Settings/Integrations/AppleBusinessManager/Setup/index.tsx",
      ),
      "utf8",
    );

    assert.match(source, /label="ABM ID"/);
    assert.doesNotMatch(source, /label="ABM_ID"/);
  });
});
