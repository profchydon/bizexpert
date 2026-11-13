import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("RecCollapsibleLayout", () => {
  it("disables Recommended for you with a Coming soon tooltip", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/components/recommendations/RecCollapsibleLayout.tsx",
      ),
      "utf8",
    );

    assert.match(source, /Tooltip/);
    assert.match(source, /Coming soon/);
    assert.match(source, /Recommended for you/);
    assert.match(source, /flex w-full items-center gap-2 px-4 py-3/);
    assert.doesNotMatch(source, /setOpen/);
    assert.doesNotMatch(source, /RecCard/);
  });
});
