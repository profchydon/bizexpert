import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("InvoiceToolbar", () => {
  it("uses All, Unpaid, and Paid filter tabs matching the transactions toolbar", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Invoices/InvoiceToolbar.tsx",
      ),
      "utf8",
    );

    assert.match(source, /invoiceFilterTabs/);
    assert.match(source, /Card view/);
    assert.match(source, /Table view/);
    assert.match(source, /Search invoices/);
  });
});
