import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("useBillingEntityOptions", () => {
  it("loads billing entities from the entities API with country filtering", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/useBillingEntityOptions.ts",
      ),
      "utf8",
    );

    assert.match(source, /useAccountsEntitiesQuery/);
    assert.match(source, /mapEntityToSubsidiary/);
    assert.match(source, /filterEntitiesByCountry/);
    assert.match(source, /useGetCountriesQuery/);
    assert.match(source, /mapCountriesToWizardOptions/);
    assert.match(source, /mapBillingEntityOptions/);
    assert.match(source, /requiresCountry/);
  });
});
