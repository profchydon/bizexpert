import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("useWorkspaceEntities global admin gate", () => {
  it("skips GET /entities for non-global admins and uses session memberships", () => {
    const hookSource = readFileSync(
      "src/app/dashboard/NavBar/useWorkspaceEntities.ts",
      "utf8",
    );
    const accountsSource = readFileSync(
      "src/container/Dashboard/Accounts/hooks/useAccountsData.ts",
      "utf8",
    );

    assert.match(hookSource, /access\.isGlobalAdmin/);
    assert.match(hookSource, /skip: !shouldFetchEntities/);
    assert.match(hookSource, /mapMembershipsToWorkspaceEntities/);
    assert.match(hookSource, /resolveEntitiesListCompanyId/);
    assert.match(hookSource, /companyId: listCompanyId as string/);
    assert.match(
      accountsSource,
      /skip: !companyId \|\| !access\.isGlobalAdmin/,
    );
    assert.match(accountsSource, /mapMembershipsToVisibleSubsidiaries/);
    assert.match(accountsSource, /useEntitiesListCompanyId/);
  });
});
