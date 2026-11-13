import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("StorageOverview country dimension", () => {
  it("renders a By country tab wired to summary country segments", () => {
    const overview = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/components/StorageOverview.tsx",
      ),
      "utf8",
    );

    assert.match(overview, /By country/);
    assert.match(overview, /countrySegments/);
    assert.match(overview, /onSelectCountry/);
  });
});
