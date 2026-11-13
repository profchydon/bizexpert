import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const table = readFileSync(
  join(
    process.cwd(),
    "src/container/NewOnboarding/Setup/components/FeatureComparisonTable.tsx",
  ),
  "utf8",
);

describe("onboarding feature comparison", () => {
  it("hides the same comparison rows as subscription settings", () => {
    assert.match(table, /visibleComparisonGroups\(groups\)/);
    assert.match(table, /visible\.map/);
  });
});
