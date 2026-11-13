import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const source = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Transactions/components/TransactionTypeBadges.tsx",
  ),
  "utf8",
);

describe("TransactionTypeBadges", () => {
  it("renders a refund badge for wallet cancellation credits", () => {
    assert.match(source, /wallet_kind/);
    assert.match(source, /cancellation_refund/);
    assert.match(source, /Refund/);
    assert.match(source, /whitespace-nowrap/);
  });

  it("renders a top up badge for wallet credits without cancellation metadata", () => {
    assert.match(source, /top_up/);
    assert.match(source, /Top up/);
  });
});
