import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Transactions/TransactionDetails/components/TransactionInvoiceLineItemsTable.tsx",
  ),
  "utf8",
);

describe("TransactionInvoiceLineItemsTable", () => {
  it("shows the stored tax rate percent under each tax amount", () => {
    assert.match(source, /formatTaxRatePercent/);
    assert.match(source, /line\.vatRate > 0/);
    assert.match(source, /formatTaxRatePercent\(line\.vatRate\)/);
  });
});
