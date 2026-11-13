import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

describe("tax display company id", () => {
  it("loads tax display for the active entity", () => {
    const hook = source("../../../hooks/useTaxContext.ts");
    assert.match(hook, /useWorkspaceCompanyId\(\)/);
    assert.match(hook, /companyId: companyId as string/);
    assert.doesNotMatch(hook, /companyId: company\?\.id/);
  });

  it("saves tax display for the active entity", () => {
    const card = source("./TaxDisplayCard.tsx");
    assert.match(card, /useWorkspaceCompanyId\(\)/);
    assert.match(card, /companyId,/);
    assert.doesNotMatch(card, /companyId: company\.id/);
  });
});
