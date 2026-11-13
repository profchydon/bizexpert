import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("OfficeClosedBadge", () => {
  it("uses the design-system error pill, not gray", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/Offices/components/OfficeClosedBadge.tsx",
      ),
      "utf8",
    );
    const overview = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/Offices/detail/components/OfficeOverviewCard.tsx",
      ),
      "utf8",
    );

    assert.match(source, /color="error"/);
    assert.match(source, /type="pill-color"/);
    assert.doesNotMatch(source, /color="gray"/);
    assert.match(overview, /closed:[\s\S]*color: "gray"/);
  });
});
