import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("MapLocationFinder", () => {
  it("lets Places suggestion props own the item key", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/mapLocation/MapLocationFinder.tsx"),
      "utf8",
    );

    assert.match(source, /getSuggestionItemProps\(suggestion,/);
    assert.doesNotMatch(source, /key=\{index\}[\s\S]*getSuggestionItemProps/s);
  });
});
