import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getTransactionEntityLabel } from "./transactionEntityLabel";

const summaryCard = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Transactions/TransactionDetails/components/TransactionSummaryCard.tsx",
  ),
  "utf8",
);

describe("getTransactionEntityLabel", () => {
  it("uses entity_name from the transaction payload", () => {
    assert.equal(getTransactionEntityLabel("Intensa"), "Intensa");
    assert.equal(getTransactionEntityLabel("  Intensa  "), "Intensa");
    assert.match(
      summaryCard,
      /getTransactionEntityLabel\(transaction\?\.entity_name\)/,
    );
  });

  it("falls back to a dash when entity_name is missing", () => {
    assert.equal(getTransactionEntityLabel(), "-");
    assert.equal(getTransactionEntityLabel(null), "-");
    assert.equal(getTransactionEntityLabel("   "), "-");
    assert.doesNotMatch(summaryCard, /country_name/);
  });
});
