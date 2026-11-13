import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const source = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Settings/TaxJurisdictionCard.tsx",
  ),
  "utf8",
);

describe("tax jurisdiction account management link", () => {
  it("opens account management and tracks the pending navigation", () => {
    assert.match(source, /useTransitionRouter/);
    assert.match(source, /isLoading=\{isPending\}/);
    assert.match(source, /push\(routes\.ACCOUNTS\)/);
    assert.match(source, /Account management/);
  });
});
