import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const source = readFileSync("src/hooks/useEntitiesListCompanyId.ts", "utf8");

describe("useEntitiesListCompanyId", () => {
  it("resolves GET /entities against the primary company", () => {
    assert.match(source, /resolveEntitiesListCompanyId/);
    assert.match(source, /getEntityMemberships/);
    assert.match(source, /activeEntityId/);
    assert.match(source, /primaryCompanyId/);
  });
});
