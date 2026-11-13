import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveAbmOrgId, resolveCatalogIntegrationId } from "./abmOrgId";

describe("resolveCatalogIntegrationId", () => {
  it("returns integration_id from a live integration record", () => {
    assert.equal(
      resolveCatalogIntegrationId({
        integration_id: "catalog-id",
        integration: { id: "nested-id" },
      }),
      "catalog-id",
    );
  });

  it("falls back to integration.id when integration_id is missing", () => {
    assert.equal(
      resolveCatalogIntegrationId({ integration: { id: "nested-id" } }),
      "nested-id",
    );
  });

  it("falls back to the catalog integration id", () => {
    assert.equal(
      resolveCatalogIntegrationId(undefined, "catalog-id"),
      "catalog-id",
    );
  });
});

describe("resolveAbmOrgId", () => {
  it("returns orgId from an object", () => {
    assert.equal(resolveAbmOrgId({ orgId: "ORG-12345678" }), "ORG-12345678");
  });

  it("returns orgId from a JSON string", () => {
    assert.equal(resolveAbmOrgId('{"orgId":"ORG-12345678"}'), "ORG-12345678");
  });

  it("returns an empty string when other_details is missing", () => {
    assert.equal(resolveAbmOrgId(undefined), "");
    assert.equal(resolveAbmOrgId(null), "");
  });

  it("returns an empty string for invalid JSON", () => {
    assert.equal(resolveAbmOrgId("not-json"), "");
  });
});
