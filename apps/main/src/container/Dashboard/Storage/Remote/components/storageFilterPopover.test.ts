import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("StorageFilterPopover", () => {
  it("anchors the filter panel to the trigger end edge", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/components/StorageFilterPopover.tsx",
      ),
      "utf8",
    );

    assert.match(source, /placement="bottom right"/);
    assert.match(source, /containerPadding=\{16\}/);
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/Storage/Remote/components/storageFilterPopoverLayout.ts",
        ),
        "utf8",
      ),
      /overflow-y-auto/,
    );
    assert.doesNotMatch(source, /placement="bottom left"/);
  });
});
