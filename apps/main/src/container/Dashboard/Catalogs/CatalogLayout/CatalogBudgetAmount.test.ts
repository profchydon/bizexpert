import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const layout = readFileSync(
  "src/container/Dashboard/Catalogs/CatalogLayout/index.tsx",
  "utf8",
);
const amount = readFileSync(
  "src/container/Dashboard/Catalogs/CatalogLayout/CatalogBudgetAmount.tsx",
  "utf8",
);

describe("catalog budget amount", () => {
  it("renders the billing currency symbol with the budget", () => {
    assert.match(layout, /companyBillingCurrencySymbol\(company\)/);
    assert.match(layout, /<CatalogBudgetAmount/);
    assert.doesNotMatch(layout, /\$\{formatAmount/);
    assert.match(amount, /\{symbol\}/);
    assert.match(amount, /formatAmount\(amount\)/);
  });
});
