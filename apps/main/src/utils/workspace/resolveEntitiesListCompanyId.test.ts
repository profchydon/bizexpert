import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveEntitiesListCompanyId } from "./resolveEntitiesListCompanyId";

const nigeria = {
  id: "01a01973-c039-71cf-8290-2aeed95faa66",
  is_primary: false,
  parent_company_id: "company-primary",
};

const primary = {
  id: "company-primary",
  is_primary: true,
  parent_company_id: null,
};

describe("resolveEntitiesListCompanyId", () => {
  it("uses the primary company in the global workspace", () => {
    assert.equal(
      resolveEntitiesListCompanyId({
        primaryCompanyId: "company-primary",
        activeEntityId: null,
        memberships: [primary, nigeria],
      }),
      "company-primary",
    );
  });

  it("uses parent_company_id when the active workspace is not primary", () => {
    assert.equal(
      resolveEntitiesListCompanyId({
        primaryCompanyId: "company-primary",
        activeEntityId: nigeria.id,
        memberships: [primary, nigeria],
      }),
      "company-primary",
    );
  });

  it("keeps the primary entity id when that workspace is selected", () => {
    assert.equal(
      resolveEntitiesListCompanyId({
        primaryCompanyId: "company-primary",
        activeEntityId: primary.id,
        memberships: [primary, nigeria],
      }),
      "company-primary",
    );
  });

  it("falls back to the session company when the membership has no parent", () => {
    assert.equal(
      resolveEntitiesListCompanyId({
        primaryCompanyId: "company-primary",
        activeEntityId: "entity-unknown",
        memberships: [nigeria],
      }),
      "company-primary",
    );
  });

  it("uses parent_company_id when the session company is a subsidiary", () => {
    assert.equal(
      resolveEntitiesListCompanyId({
        primaryCompanyId: nigeria.id,
        activeEntityId: null,
        memberships: [primary, nigeria],
      }),
      "company-primary",
    );
  });

  it("uses parent_company_id when both the session and workspace are a subsidiary", () => {
    assert.equal(
      resolveEntitiesListCompanyId({
        primaryCompanyId: nigeria.id,
        activeEntityId: nigeria.id,
        memberships: [primary, nigeria],
      }),
      "company-primary",
    );
  });
});
