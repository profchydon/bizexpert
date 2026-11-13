import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("StorageToolbar", () => {
  it("does not render the Group by country control", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/components/StorageToolbar.tsx",
      ),
      "utf8",
    );

    assert.doesNotMatch(source, /Group by country/);
    assert.doesNotMatch(source, /storagetoolbar-button/);
    assert.match(source, /ml-auto/);
    assert.match(source, /Search device, model, serial, country/);
  });
});
