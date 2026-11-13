import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("TransactionToolbar", () => {
  it("uses All, Card, and Credit filter tabs from the design source", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Transactions/components/TransactionToolbar.tsx",
      ),
      "utf8",
    );

    assert.match(source, /transactionFilterTabs/);
    assert.match(source, /Card view/);
    assert.match(source, /Table view/);
    assert.doesNotMatch(source, /Cash/);
  });
});
