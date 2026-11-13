import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("isNestedRadixOverlay", () => {
  it("matches radix popover portal markers used by slideout dismiss guards", () => {
    const source = readFileSync(
      join(process.cwd(), "src/utils/isNestedRadixOverlay.ts"),
      "utf8",
    );

    assert.match(source, /data-radix-popper-content-wrapper/);
    assert.match(source, /data-radix-popover-content/);
  });
});
