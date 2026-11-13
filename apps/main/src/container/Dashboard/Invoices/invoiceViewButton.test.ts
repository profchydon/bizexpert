import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("InvoiceViewButton", () => {
  it("opens the invoice url in a new tab", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Invoices/InvoiceViewButton.tsx",
      ),
      "utf8",
    );

    assert.match(source, /invoiceViewUrl/);
    assert.match(source, /target="_blank"/);
    assert.match(source, /rel="noopener noreferrer"/);
  });
});
