import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("StoragePageHeader", () => {
  it("disables Import devices with a plan-aware tooltip", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/components/StoragePageHeader.tsx",
      ),
      "utf8",
    );

    assert.match(source, /DisabledWithTooltip/);
    assert.match(source, /reason=\{importDisabledReason\}/);
    assert.match(source, /Import devices/);
    assert.match(source, /isDisabled/);
    assert.doesNotMatch(source, /onImport/);
  });
});
