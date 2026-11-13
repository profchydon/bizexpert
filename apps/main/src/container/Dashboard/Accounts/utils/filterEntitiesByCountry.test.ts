import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Subsidiary } from "../types";
import {
  entityMatchesCountry,
  filterEntitiesByCountry,
} from "./filterEntitiesByCountry";

const entity = (region: string): Subsidiary => ({
  id: `entity-${region}`,
  name: region,
  region,
  currency: "USD",
  admins: [],
  status: "operational",
  officesCount: 0,
  creditState: "assessing",
  cardOnFile: true,
  createdDaysAgo: 0,
  createdBy: "ops@example.com",
  isPrimary: false,
  billingMode: "self",
  billingEntityId: `entity-${region}`,
  billingEntityName: region,
  billingCurrency: "USD",
});

describe("filterEntitiesByCountry", () => {
  it("matches entities by country name", () => {
    assert.equal(
      entityMatchesCountry(entity("United Kingdom"), "United Kingdom"),
      true,
    );
    assert.equal(
      entityMatchesCountry(entity("United Kingdom"), "united kingdom"),
      true,
    );
    assert.equal(
      entityMatchesCountry(entity("United Kingdom"), "Nigeria"),
      false,
    );
  });

  it("returns all entities when no country is selected", () => {
    const entities = [entity("United Kingdom"), entity("Nigeria")];
    assert.deepEqual(filterEntitiesByCountry(entities, null), entities);
    assert.deepEqual(filterEntitiesByCountry(entities, ""), entities);
  });

  it("filters entities to the selected country", () => {
    const entities = [entity("United Kingdom"), entity("Nigeria")];
    const filtered = filterEntitiesByCountry(entities, "Nigeria");
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0]?.region, "Nigeria");
  });

  it("matches entities when the API stores an ISO country code", () => {
    assert.equal(
      entityMatchesCountry(entity("GB"), "United Kingdom", "GB"),
      true,
    );
    assert.equal(
      entityMatchesCountry(entity("United Kingdom"), "United Kingdom", "GB"),
      true,
    );
  });
});
