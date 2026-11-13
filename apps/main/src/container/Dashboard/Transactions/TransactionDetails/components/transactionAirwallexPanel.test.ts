import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const airwallexSource = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Transactions/TransactionDetails/components/TransactionAirwallexPanel.tsx",
  ),
  "utf8",
);

const summarySource = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Transactions/TransactionDetails/components/TransactionSummaryCard.tsx",
  ),
  "utf8",
);

const typesSource = readFileSync(
  join(process.cwd(), "src/types/transactions.ts"),
  "utf8",
);

describe("TransactionAirwallexPanel", () => {
  it("keeps a single invoice shape with an Airwallex id", () => {
    assert.match(typesSource, /export interface ITransactionInvoice/);
    assert.match(typesSource, /id\?: string \| null/);
    assert.equal((typesSource.match(/^\s*invoice\?:/gm) ?? []).length, 1);
  });

  it("shows the Airwallex transaction ID with copy support", () => {
    assert.match(airwallexSource, /Airwallex transaction ID/);
    assert.match(airwallexSource, /useClipboard/);
    assert.match(airwallexSource, /invoice\?\.id/);
  });

  it("renders transaction actions instead of external link", () => {
    assert.match(airwallexSource, /<TransactionDetailActions/);
    assert.doesNotMatch(airwallexSource, /View Airwallex invoice/);
    assert.match(airwallexSource, /!transaction\?\.invoice/);
  });
});

describe("TransactionSummaryCard", () => {
  it("does not render cancellation reason on the detail page", () => {
    assert.doesNotMatch(summarySource, /Cancellation reason/);
    assert.match(summarySource, /TransactionAirwallexPanel/);
  });

  it("maps invoice PAID through the shared status badge", () => {
    assert.match(summarySource, /resolveTransactionDisplayStatus/);
    assert.match(summarySource, /TransactionStatusBadge/);
  });
});
